export default function Blog() {
  // Basit statik blog yazıları
  const blogPosts = [
    {
      id: 1,
      title: "Diş Fırçalama Teknikleri",
      excerpt: "Doğru diş fırçalama teknikleri ile ağız sağlığınızı koruyun. Günde en az 2 kez diş fırçalamak diş sağlığı için önemlidir.",
      content: `
        Diş sağlığını korumak için doğru fırçalama teknikleri çok önemlidir. İşte bilmeniz gerekenler:
        
        1. Günde en az 2 kez, 2 dakika süreyle diş fırçalayın
        2. Yumuşak kıllı diş fırçası kullanın
        3. Fluorlu diş macunu tercih edin
        4. Dairesel hareketlerle nazikçe fırçalayın
        5. Dilinizi de fırçalamayı unutmayın
        
        Bu basit adımları takip ederek diş çürükleri ve diş eti hastalıklarından korunabilirsiniz.
      `,
      date: "15 Aralık 2024"
    },
    {
      id: 2,
      title: "Diş İmplantı Nedir?",
      excerpt: "Eksik dişleriniz için en iyi çözüm olan diş implantı hakkında bilmeniz gereken her şey.",
      content: `
        Diş implantı, kaybedilen dişlerin yerine yerleştirilen titanyum vidalar ve üzerine monte edilen yapay dişlerdir.
        
        İmplantın avantajları:
        - Doğal diş görünümü sağlar
        - Komşu dişlere zarar vermez
        - Uzun ömürlüdür
        - Kemik kaybını önler
        
        İmplant tedavisi genellikle 3-6 ay sürer ve yüksek başarı oranına sahiptir.
      `,
      date: "10 Aralık 2024"
    },
    {
      id: 3,
      title: "Çocuklarda Diş Bakımı",
      excerpt: "Çocuğunuzun diş sağlığı için bilmeniz gerekenler ve yapmanız gereken uygulamalar.",
      content: `
        Çocukların diş sağlığı erken yaşta başlamalıdır:
        
        0-2 yaş:
        - İlk diş çıktığında diş hekimi kontrolü
        - Su ile temizlik
        
        2-6 yaş:
        - Fluorlu diş macunu (bezelye büyüklüğünde)
        - Yetişkin gözetiminde fırçalama
        - 6 ayda bir diş hekimi kontrolü
        
        6+ yaş:
        - Bağımsız diş fırçalama
        - Diş ipi kullanımı öğretme
        - Koruyucu uygulamalar (fissür sealant)
      `,
      date: "5 Aralık 2024"
    }
  ]

  return (
    <div className="min-h-screen pt-16">
      {/* Header Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Diş Sağlığı Blogu</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Diş sağlığınız için faydalı bilgiler ve öneriler
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {blogPosts.map((post) => (
                <article key={post.id} className="bg-white p-8 rounded-lg shadow-lg">
                  <div className="mb-4">
                    <span className="text-gray-600 text-sm font-medium">{post.date}</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="border-t pt-6">
                    <div className="prose max-w-none">
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {post.content}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Dr. Dilruba Yiğit tarafından yazıldı
                      </span>
                      <span className="text-sm text-gray-600">
                        📚 Diş Sağlığı
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Diş Sağlığınız İçin Randevu Alın
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Sorularınız için veya kontrole gelmek istiyorsanız hemen randevu alabilirsiniz
          </p>
          <a 
            href="/auth/login" 
            className="bg-gray-900 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors inline-block"
          >
            Randevu Al
          </a>
        </div>
      </section>
    </div>
  )
} 