import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const { name, email, phone, message } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Ad soyad, e-posta ve mesaj alanları zorunludur' },
        { status: 400 }
      )
    }

    // Save contact message to database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
        isRead: false
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Mesajınız başarıyla gönderildi! En kısa sürede size döneceğiz.',
      id: contactMessage.id
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    )
  }
} 