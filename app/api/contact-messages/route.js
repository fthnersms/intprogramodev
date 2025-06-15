import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request) {
  try {
    // Check authentication
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied. Admin only.' }, { status: 403 })
    }

    // Fetch contact messages ordered by newest first
    const contactMessages = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(contactMessages)

  } catch (error) {
    console.error('Error fetching contact messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact messages' },
      { status: 500 }
    )
  }
} 