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

    // Check if user is ADMIN
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { role: true }
    })

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ 
        error: 'Bu işlemi yapmaya yetkiniz yok. Sadece admin kullanıcıları erişebilir.' 
      }, { status: 403 })
    }

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            appointments: true,
            sentMessages: true,
            receivedMessages: true
          }
        }
      },
      orderBy: [
        { role: 'desc' }, // ADMIN first, then DOCTOR, then USER
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Users fetch error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
} 