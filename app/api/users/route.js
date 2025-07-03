import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if user is authenticated
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { role: true }
    })

    if (!currentUser) {
      return NextResponse.json({ 
        error: 'Kullanıcı bulunamadı.' 
      }, { status: 404 })
    }

    // Get users based on role
    let users
    if (currentUser.role === 'ADMIN') {
      // Admin can see all users
      users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        },
        orderBy: [
          { role: 'desc' },
          { name: 'asc' }
        ]
      })
    } else if (currentUser.role === 'DOCTOR') {
      // Doctor can see all users except other admins
      users = await prisma.user.findMany({
        where: {
          role: {
            in: ['USER', 'DOCTOR']
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        },
        orderBy: [
          { role: 'desc' },
          { name: 'asc' }
        ]
      })
    } else {
      // User can only see admins and doctors
      users = await prisma.user.findMany({
        where: {
          role: {
            in: ['ADMIN', 'DOCTOR']
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        },
        orderBy: [
          { role: 'desc' },
          { name: 'asc' }
        ]
      })
    }

    return NextResponse.json(users)
  } catch (error) {
    console.error('Users fetch error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
} 