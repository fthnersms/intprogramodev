import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        date: true,
        time: true,
        service: true,
        status: true,
        userId: true
      },
      orderBy: {
        id: 'asc'
      }
    })

    console.log('All appointments in database:', appointments)
    return NextResponse.json({
      count: appointments.length,
      appointments: appointments
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ error: 'Debug failed' }, { status: 500 })
  }
} 