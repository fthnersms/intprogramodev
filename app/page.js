import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white py-20 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-light text-gray-900 mb-6 tracking-wide">DYENT</h1>
          <h2 className="text-xl text-gray-600 mb-8 font-light">Dr. Dilruba Yiğit</h2>
          <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
            Modern diş hekimliği teknolojileri ile güvenilir ve kaliteli diş sağlığı hizmetleri
          </p>
          <Link 
            href="/auth/login" 
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all inline-block shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Randevu Al
          </Link>
        </div>
      </section>

      {/* Hizmetlerimiz */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-16 text-gray-900">Hizmetlerimiz</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="text-gray-600 text-4xl mb-4">🦷</div>
              <h3 className="text-xl font-medium mb-3 text-gray-900">Genel Diş Hekimliği</h3>
              <p className="text-gray-600 leading-relaxed">Rutin kontroller, temizlik ve temel diş tedavileri</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="text-gray-600 text-4xl mb-4">✨</div>
              <h3 className="text-xl font-medium mb-3 text-gray-900">Estetik Diş Hekimliği</h3>
              <p className="text-gray-600 leading-relaxed">Beyazlatma, veneer ve gülüş tasarımı</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="text-gray-600 text-4xl mb-4">🔧</div>
              <h3 className="text-xl font-medium mb-3 text-gray-900">Tedavi Edici Diş Hekimliği</h3>
              <p className="text-gray-600 leading-relaxed">Dolgu, kanal tedavisi ve diş çekimi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hakkımızda */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-light mb-8 text-gray-900">Dr. Dilruba Yiğit</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Alanında uzman diş hekimi olarak, hasta memnuniyetini ve kaliteli hizmeti ön planda tutuyoruz. 
              Modern teknoloji ve sterilizasyon standartlarıyla güvenli tedavi ortamı sağlıyoruz.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Her hasta için kişiselleştirilmiş tedavi planları hazırlayarak, 
              diş sağlığınızı en iyi şekilde korumayı hedefliyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* İletişim */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-light mb-12">İletişim</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-medium mb-2">📍 Adres</h3>
              <p className="text-gray-300">Samsun, Türkiye</p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">📞 Telefon</h3>
              <p className="text-gray-300">+90 539 662 00 64</p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">📧 E-posta</h3>
              <p className="text-gray-300">info@dyent.com</p>
            </div>
          </div>
          <div className="mt-12">
            <Link 
              href="/auth/login" 
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all inline-block shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Hemen Randevu Al
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
