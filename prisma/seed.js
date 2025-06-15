const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 12)
  const userPassword = await bcrypt.hash('user123', 12)

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dyent.com' },
    update: {},
    create: {
      email: 'admin@dyent.com',
      name: 'Dr. Dilruba Yiğit',
      phone: '+90 (216) 555 01 23',
      password: adminPassword,
      role: 'ADMIN'
    }
  })

  // Create regular user
  const user = await prisma.user.upsert({
    where: { email: 'user@dyent.com' },
    update: {},
    create: {
      email: 'user@dyent.com',
      name: 'Ahmet Yılmaz',
      phone: '+90 (532) 123 45 67',
      password: userPassword,
      role: 'USER'
    }
  })

  // Create sample appointments
  await prisma.appointment.createMany({
    data: [
      {
        userId: user.id,
        name: 'Ahmet Yılmaz',
        email: 'user@dyent.com',
        phone: '+90 (532) 123 45 67',
        date: new Date('2024-12-20'),
        time: '14:00',
        service: 'Genel Muayene',
        notes: 'Rutin kontrol',
        status: 'PENDING'
      },
      {
        name: 'Mehmet Demir',
        email: 'mehmet@example.com',
        phone: '+90 (533) 456 78 90',
        date: new Date('2024-12-21'),
        time: '15:30',
        service: 'Diş Temizliği',
        status: 'APPROVED'
      },
      {
        name: 'Ayşe Kaya',
        email: 'ayse@example.com',
        phone: '+90 (534) 567 89 01',
        date: new Date('2024-12-22'),
        time: '10:00',
        service: 'Dolgu',
        notes: 'Sol üst 6 numaralı diş',
        status: 'COMPLETED'
      }
    ]
  })

  console.log('✅ Database seeded successfully!')
  console.log('📧 Admin: admin@dyent.com / admin123')
  console.log('👤 User: user@dyent.com / user123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 