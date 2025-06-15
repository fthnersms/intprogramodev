import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function PATCH(request, { params }) {
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

    const messageId = parseInt(params.id)

    // Check if contact message exists
    const existingMessage = await prisma.contactMessage.findUnique({
      where: { id: messageId }
    })

    if (!existingMessage) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    // Update contact message as read
    const updatedMessage = await prisma.contactMessage.update({
      where: { id: messageId },
      data: { isRead: true }
    })

    return NextResponse.json({
      success: true,
      message: updatedMessage
    })

  } catch (error) {
    console.error('Error marking message as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark message as read' },
      { status: 500 }
    )
  }
} 