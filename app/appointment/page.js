'use client'

import { useState, useEffect } from 'react'

export default function Appointment() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    service: '',
    notes: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const services = [
    'Genel Muayene',
    'Diş Temizliği',
    'Dolgu',
    'Kanal Tedavisi',
    'Diş Çekimi',
    'Diş Beyazlatma',
    'İmplant Konsültasyonu',
    'Estetik Diş Hekimliği',
    'Çocuk Diş Hekimliği'
  ]

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ]

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const userData = await response.json()
        
        // Check if user is allowed to make appointments (only USER role)
        if (userData.role !== 'USER') {
          alert('⚠️ Sadece hasta kullanıcıları randevu alabilir.')
          window.location.href = '/dashboard'
          return
        }
        
        setUser(userData)
        // Auto-fill form with user data
        setFormData(prev => ({
          ...prev,
          name: userData.name,
          email: userData.email
        }))
      } else {
        // Redirect to login if not authenticated
        window.location.href = '/auth/login'
        return
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      window.location.href = '/auth/login'
      return
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const appointmentData = {
        ...formData,
        // If user is logged in, use their data
        name: user ? user.name : formData.name,
        email: user ? user.email : formData.email,
        userId: user ? user.id : null
      }

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      })

      if (response.ok) {
        setMessage('Randevunuz başarıyla kaydedildi! En kısa sürede size döneceğiz.')
        setFormData({
          name: user ? user.name : '',
          email: user ? user.email : '',
          phone: '',
          date: '',
          time: '',
          service: '',
          notes: ''
        })
      } else {
        const error = await response.json()
        setMessage(error.error || 'Bir hata oluştu. Lütfen tekrar deneyin.')
      }
    } catch (error) {
      setMessage('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Bugünden itibaren 30 gün sonrasına kadar randevu alınabilir
  const today = new Date().toISOString().split('T')[0]
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 30)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-light mb-4">Randevu Al</h1>
          <p className="text-xl font-light max-w-2xl mx-auto opacity-90">
            {user ? `Merhaba ${user.name.split(' ')[0]}, randevu almak için formu doldurun` : 'Dr. Dilruba Yiğit ile randevu almak için formu doldurun'}
          </p>
        </div>
      </section>

      {/* Appointment Form */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.includes('başarıyla') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-light text-gray-900 mb-6">Randevu Bilgileri</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Show user info for authenticated users */}
                {user && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Hasta Bilgileri</h3>
                    <p className="text-gray-700"><strong>Ad Soyad:</strong> {user.name}</p>
                    <p className="text-gray-700"><strong>E-posta:</strong> {user.email}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                      Tarih *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={today}
                      max={maxDateStr}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                      Saat *
                    </label>
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    >
                      <option value="">Saat seçin</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                    Hizmet *
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  >
                    <option value="">Hizmet seçin</option>
                    {services.map((service) => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Notlar (Opsiyonel)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    placeholder="Özel bir durumunuz varsa belirtebilirsiniz..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  {isSubmitting ? 'Randevu Kaydediliyor...' : 'Randevu Al'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 