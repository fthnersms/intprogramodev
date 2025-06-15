import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(request, { params }) {
  console.log('=== PATCH REQUEST START ===')
  console.log('Params:', params)
  console.log('URL Path:', request.url)
  
  try {
    // Parse the request body first
    const requestBody = await request.json()
    console.log('Request body:', requestBody)
    
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value
    console.log('Token exists:', !!token)

    if (!token) {
      console.log('No token found - returning 401')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    console.log('Decoded token:', decoded)
    
    if (!decoded || decoded.role !== 'ADMIN') {
      console.log('Access denied - not admin')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { status } = requestBody
    const appointmentId = params.id

    console.log('Processing update:', { appointmentId, status, paramsId: params.id })

    if (!status) {
      console.log('Status is missing from request')
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    if (!appointmentId || typeof appointmentId !== 'string') {
      console.log('Invalid appointment ID:', params.id)
      return NextResponse.json({ error: 'Invalid appointment ID' }, { status: 400 })
    }

    // Check if appointment exists
    console.log('Checking if appointment exists...')
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId }
    })

    if (!existingAppointment) {
      console.log('Appointment not found:', appointmentId)
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    console.log('Existing appointment found:', existingAppointment)

    // Update appointment status
    console.log('Updating appointment...')
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })

    console.log('Appointment updated successfully:', updatedAppointment.id)
    console.log('=== PATCH REQUEST SUCCESS ===')
    return NextResponse.json(updatedAppointment)
  } catch (error) {
    console.error('=== PATCH REQUEST ERROR ===')
    console.error('Error details:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json({ error: `Server error: ${error.message}` }, { status: 500 })
  }
} 