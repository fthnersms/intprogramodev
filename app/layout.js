import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'DYENT - Dr. Dilruba Yiğit Diş Kliniği',
  description: 'Dr. Dilruba Yiğit liderliğinde modern diş hekimliği hizmetleri, uzman doktor kadrosu ve teknolojik cihazlarla diş sağlığınızı koruyoruz.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
