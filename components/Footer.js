import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo ve Açıklama */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">DYENT</h3>
            <p className="text-gray-300 mb-4">
              Dr. Dilruba Yiğit liderliğinde modern diş hekimliği hizmetleri. 
              Diş sağlığınız için güvenilir ve kaliteli çözümler.
            </p>
            <p className="text-gray-300">
              📍 Samsun, Türkiye<br />
              📞 +90 (539) 662 00 64<br />
              📧 info@dyent.com
            </p>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hızlı Linkler</h4>
            <ul className="space-y-2">
              <li>
                              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Ana Sayfa
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
                Hizmetlerimiz
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                İletişim
              </Link>
            </li>
            </ul>
          </div>

          {/* Çalışma Saatleri */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Çalışma Saatleri</h4>
            <div className="text-gray-300 space-y-1">
              <p>Pazartesi - Cuma</p>
              <p className="text-white">09:00 - 18:00</p>
              <p>Cumartesi</p>
              <p className="text-white">09:00 - 16:00</p>
              <p>Pazar</p>
              <p className="text-gray-500">Kapalı</p>
            </div>
          </div>
        </div>

        {/* Alt Kısım */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2025 DYENT - Dilruba Yiğit. Tüm hakları saklıdır.

            </p>
            <Link 
              href="/auth/login" 
              className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Randevu Al
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 