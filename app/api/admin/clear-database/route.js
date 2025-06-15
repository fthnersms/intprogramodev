import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(request) {
  console.log('🔥 Clear Database API Called')
  try {
    // Check authentication
    const token = request.cookies.get('token')?.value
    console.log('🔑 Token exists:', !!token)
    
    if (!token) {
      console.log('❌ No token found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    console.log('🔓 Token decoded:', !!decoded, decoded?.userId)
    if (!decoded) {
      console.log('❌ Token verification failed')
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if user is admin
    console.log('👤 Looking for user:', decoded.userId)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })
    console.log('👤 User found:', !!user, user?.role)

    if (!user || user.role !== 'ADMIN') {
      console.log('❌ Access denied - not admin')
      return NextResponse.json({ error: 'Access denied. Admin only.' }, { status: 403 })
    }

    // Clear all tables in correct order (due to foreign key constraints)
    console.log('🗑️ Starting database cleanup...')
    
    let deletedMessages = { count: 0 }
    let deletedContactMessages = { count: 0 }
    let deletedAppointments = { count: 0 }
    let deletedUsers = { count: 0 }
    
    try {
      // Delete messages first (has foreign keys to users)
      deletedMessages = await prisma.message.deleteMany({})
      console.log(`✅ Deleted ${deletedMessages.count} user messages`)
    } catch (error) {
      console.log('ℹ️ No user messages to delete or error:', error.message)
    }
    
    try {
      // Delete contact messages (independent table)
      deletedContactMessages = await prisma.contactMessage.deleteMany({})
      console.log(`✅ Deleted ${deletedContactMessages.count} contact messages`)
    } catch (error) {
      console.log('ℹ️ No contact messages to delete or error:', error.message)
    }
    
    try {
      // Delete appointments (can have foreign key to users, but nullable)
      deletedAppointments = await prisma.appointment.deleteMany({})
      console.log(`✅ Deleted ${deletedAppointments.count} appointments`)
    } catch (error) {
      console.log('ℹ️ No appointments to delete or error:', error.message)
    }
    
    try {
      // Delete users (except the current admin)
      deletedUsers = await prisma.user.deleteMany({
        where: {
          NOT: {
            id: decoded.userId
          }
        }
      })
      console.log(`✅ Deleted ${deletedUsers.count} users (keeping current admin)`)
    } catch (error) {
      console.log('ℹ️ No users to delete or error:', error.message)
    }

    console.log('🎉 Database cleanup completed successfully!')

    return NextResponse.json({ 
      success: true,
      message: 'Database cleared successfully',
      deleted: {
        userMessages: deletedMessages.count,
        contactMessages: deletedContactMessages.count,
        appointments: deletedAppointments.count,
        users: deletedUsers.count
      }
    })

  } catch (error) {
    console.error('❌ Database cleanup failed:', error)
    return NextResponse.json(
      { error: 'Database cleanup failed: ' + error.message },
      { status: 500 }
    )
  }
} 