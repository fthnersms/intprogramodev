'use client'

import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        alert('✅ ' + data.message)
        setFormData({ name: '', email: '', phone: '', message: '' })
      } else {
        alert('❌ ' + data.error)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      alert('❌ Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Header Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">İletişim</h1>
          <p className="text-xl max-w-2xl mx-auto">
            DYENT'e ulaşmak için aşağıdaki bilgileri kullanabilirsiniz
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-gray-800">İletişim Bilgileri</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="text-gray-600 text-2xl">📍</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Adres</h3>
                    <p className="text-gray-600">
                      Atakum Körfez Mahallesi <br />
                      Samsun, Türkiye 55000
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="text-gray-600 text-2xl">📞</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Telefon</h3>
                    <p className="text-gray-600">
                       0539 662 00 64
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="text-gray-600 text-2xl">📧</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">E-posta</h3>
                    <p className="text-gray-600">
                      info@dyent.com<br />
                      randevu@dyent.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="text-gray-600 text-2xl">🕒</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Çalışma Saatleri</h3>
                    <div className="text-gray-600">
                      <p>Pazartesi - Cuma: 09:00 - 18:00</p>
                      <p>Cumartesi: 09:00 - 16:00</p>
                      <p>Pazar: Kapalı</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-gray-800">Bize Yazın</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mesajınız
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                >
                  Mesaj Gönder
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 