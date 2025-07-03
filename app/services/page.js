export default function Services() {
  const services = [
    {
      title: "Genel Diş Hekimliği",
      icon: "🦷",
      description: "Rutin kontroller, diş temizliği ve temel diş sağlığı hizmetleri",
      details: [
        "Ağız ve diş muayenesi",
        "Diş taşı temizliği",
        "Diş eti hastalıkları tedavisi",
        "Fluorid uygulaması"
      ]
    },
    {
      title: "Estetik Diş Hekimliği",
      icon: "✨",
      description: "Gülüşünüzü güzelleştiren estetik uygulamalar",
      details: [
        "Diş beyazlatma",
        "Porselen veneer",
        "Kompozit bonding",
        "Gülüş tasarımı"
      ]
    },
    {
      title: "Tedavi Edici Diş Hekimliği",
      icon: "🔧",
      description: "Diş problemlerinizin tedavisi için kapsamlı hizmetler",
      details: [
        "Diş dolguları",
        "Kanal tedavisi",
        "Diş çekimi",
        "Kök tedavisi"
      ]
    },
    {
      title: "Protetik Diş Hekimliği",
      icon: "🔬",
      description: "Eksik dişlerinizin yerine konulan protez uygulamaları",
      details: [
        "Tam protezler",
        "Kısmi protezler",
        "Köprü protezleri",
        "İmplant üstü protezler"
      ]
    },
    {
      title: "İmplant Tedavisi",
      icon: "⚙️",
      description: "Modern diş implantı uygulamaları ile kalıcı çözümler",
      details: [
        "Tek diş implantı",
        "Çoklu implant tedavisi",
        "All-on-4 sistem",
        "Kemik greftleme"
      ]
    },
    {
      title: "Çocuk Diş Hekimliği",
      icon: "👶",
      description: "Çocukların diş sağlığı için özel bakım ve tedavi",
      details: [
        "Süt dişi tedavileri",
        "Koruyucu uygulamalar",
        "Fissür sealant",
        "Çocuk diş hekimliği danışmanlığı"
      ]
    }
  ]

  return (
    <div className="min-h-screen pt-16">
      {/* Header Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Hizmetlerimiz</h1>
          <p className="text-xl max-w-2xl mx-auto">
            DYENT olarak diş sağlığınız için kapsamlı ve kaliteli hizmetler sunuyoruz
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-center mb-4">
                  <div className="text-5xl mb-3">{service.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                </div>
                
                <ul className="space-y-2">
                  {service.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-sm text-gray-600">
                      <span className="text-gray-600 mr-2">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Hangi Hizmete İhtiyacınız Var?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Dr. Dilruba Yiğit ile diş sağlığınız için en uygun tedavi planını belirleyin
          </p>
         
        </div>
      </section>
    </div>
  )
} 