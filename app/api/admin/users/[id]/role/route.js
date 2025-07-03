import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(request, { params }) {
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
        error: 'Bu işlemi yapmaya yetkiniz yok. Sadece admin kullanıcıları rol değiştirebilir.' 
      }, { status: 403 })
    }

    const { role } = await request.json()
    const userId = params.id

    // Validate role - Admin can only assign DOCTOR or USER roles
    if (!role || !['USER', 'DOCTOR'].includes(role)) {
      return NextResponse.json({ 
        error: 'Geçersiz rol. Sadece USER veya DOCTOR rolleri atanabilir. Admin yetkisi verilemez.' 
      }, { status: 400 })
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    // Prevent admin from changing their own role
    if (userId === decoded.userId) {
      return NextResponse.json({ 
        error: 'Kendi rolünüzü değiştiremezsiniz.' 
      }, { status: 400 })
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      message: `${targetUser.name} kullanıcısının rolü başarıyla ${role} olarak güncellendi.`,
      user: updatedUser
    })

  } catch (error) {
    console.error('Role update error:', error)
    return NextResponse.json(
      { error: 'Rol güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
} 