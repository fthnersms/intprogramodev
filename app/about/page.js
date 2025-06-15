export default function About() {
  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Hakkımızda
        </h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Dr. Dilruba Yiğit</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Alanında uzman diş hekimi olarak, hasta memnuniyetini ve kaliteli hizmeti 
              ön planda tutarak, diş sağlığınızı korumaya yönelik hizmet vermekteyiz.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Vizyonumuz</h3>
              <p className="text-gray-600 leading-relaxed">
                Modern diş hekimliği teknolojileri ile hastalarımıza en kaliteli 
                hizmeti sunmak ve toplum diş sağlığını geliştirmek.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Misyonumuz</h3>
              <p className="text-gray-600 leading-relaxed">
                Her hastamıza özel tedavi planları hazırlayarak, güvenli ve 
                konforlu bir tedavi ortamı sağlamak.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
              Kliniğimizin Özellikleri
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <span className="text-gray-600 text-xl">✓</span>
                <span className="text-gray-600">Modern teknoloji ve ekipman</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-gray-600 text-xl">✓</span>
                <span className="text-gray-600">Sterilizasyon standartları</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-gray-600 text-xl">✓</span>
                <span className="text-gray-600">Hasta memnuniyeti odaklı hizmet</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-gray-600 text-xl">✓</span>
                <span className="text-gray-600">Kişiselleştirilmiş tedavi planları</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 