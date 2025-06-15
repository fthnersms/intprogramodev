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

    // Get appointments based on user role
    let appointments
    if (decoded.role === 'ADMIN') {
      // Admin can see all appointments
      appointments = await prisma.appointment.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true
            }
          }
        },
        orderBy: {
          date: 'desc'
        }
      })
    } else {
      // Users can only see their own appointments
      appointments = await prisma.appointment.findMany({
        where: {
          userId: decoded.userId
        },
        orderBy: {
          date: 'desc'
        }
      })
    }

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Appointments fetch error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { name, email, phone, date, time, service, notes, userId } = await request.json()

    if (!name || !email || !phone || !date || !time || !service) {
      return NextResponse.json({ error: 'Gerekli alanlar eksik' }, { status: 400 })
    }

    // Convert date string to DateTime
    const appointmentDate = new Date(`${date}T${time}:00`)

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        name,
        email,
        phone,
        date: appointmentDate,
        time,
        service,
        notes: notes || '',
        status: 'PENDING',
        userId: userId || null
      }
    })

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Appointment creation error:', error)
    return NextResponse.json({ error: 'Randevu oluşturulamadı' }, { status: 500 })
  }
} 