const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  try {
    // Clean existing data
    await prisma.message.deleteMany()
    await prisma.appointment.deleteMany()
    await prisma.user.deleteMany()

    // Create demo users
    const adminPassword = await bcrypt.hash('admin123', 10)
    const userPassword = await bcrypt.hash('user123', 10)

    const admin = await prisma.user.create({
      data: {
        name: 'Dr. Dilruba Yiğit',
        email: 'admin@dyent.com',
        phone: '+90 532 123 45 67',
        password: adminPassword,
        role: 'ADMIN'
      }
    })

    const user = await prisma.user.create({
      data: {
        name: 'Ahmet Kaya',
        email: 'user@dyent.com',
        phone: '+90 532 987 65 43',
        password: userPassword,
        role: 'USER'
      }
    })

    // Create sample appointments
    const appointments = [
      {
        name: 'Mehmet Özkan',
        email: 'mehmet@email.com',
        phone: '+90 532 111 22 33',
        date: new Date('2024-12-30T09:00:00'),
        time: '09:00',
        service: 'Diş Temizliği',
        status: 'APPROVED',
        notes: 'Rutin kontrol ve temizlik',
        userId: null
      },
      {
        name: 'Ahmet Kaya',
        email: 'user@dyent.com',
        phone: '+90 532 987 65 43',
        date: new Date('2024-12-28T14:30:00'),
        time: '14:30',
        service: 'Genel Muayene',
        status: 'PENDING',
        notes: 'Diş ağrısı şikayeti',
        userId: user.id
      },
      {
        name: 'Ayşe Demir',
        email: 'ayse@email.com',
        phone: '+90 532 444 55 66',
        date: new Date('2024-12-25T10:00:00'),
        time: '10:00',
        service: 'Dolgu',
        status: 'COMPLETED',
        notes: 'Sol üst azı dişinde çürük tedavisi',
        userId: null
      }
    ]

    for (const appointmentData of appointments) {
      await prisma.appointment.create({
        data: appointmentData
      })
    }

    // Create sample messages
    await prisma.message.create({
      data: {
        content: 'Merhaba, randevu saatimi değiştirebilir miyim?',
        senderId: user.id,
        receiverId: admin.id,
        read: false
      }
    })

    await prisma.message.create({
      data: {
        content: 'Tabii ki! Hangi tarih ve saati tercih edersiniz?',
        senderId: admin.id,
        receiverId: user.id,
        read: true
      }
    })

    console.log('✅ Seed completed successfully!')
    console.log('\n👥 Demo Accounts:')
    console.log('📧 Admin: admin@dyent.com / admin123')
    console.log('📧 User: user@dyent.com / user123')
    console.log('\n📅 Sample appointments and messages created!')

  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 