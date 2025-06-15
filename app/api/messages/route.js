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

    // Get all messages for this user
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: decoded.userId },
          { receiverId: decoded.userId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Messages fetch error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request) {
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

    const { content, receiverId } = await request.json()

    if (!content || !receiverId) {
      return NextResponse.json({ error: 'Content and receiverId are required' }, { status: 400 })
    }

    // Create new message
    const message = await prisma.message.create({
      data: {
        content,
        senderId: decoded.userId,
        receiverId,
        read: false
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Message send error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
} 