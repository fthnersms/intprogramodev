'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchUserData()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/auth/login')
        return
      }
      const userData = await response.json()
      setUser(userData)
    } catch (error) {
      router.push('/auth/login')
    }
  }

  const fetchUserData = async () => {
    try {
      // Fetch user appointments from API
      const appointmentsResponse = await fetch('/api/appointments')
      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json()
        setAppointments(appointmentsData)
        console.log('User appointments loaded:', appointmentsData)
      } else {
        console.error('Failed to fetch appointments')
        setAppointments([])
      }
      
      // Fetch user messages from API
      const messagesResponse = await fetch('/api/messages')
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json()
        setMessages(messagesData)
        console.log('User messages loaded:', messagesData)
      } else {
        console.error('Failed to fetch messages')
        setMessages([])
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      setAppointments([])
      setMessages([])
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-white text-black border border-gray-400'
      case 'APPROVED': return 'bg-gray-700 text-white'
      case 'CANCELLED': return 'bg-gray-300 text-black'
      case 'COMPLETED': return 'bg-black text-white'
      default: return 'bg-white text-black border border-gray-400'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Beklemede'
      case 'APPROVED': return 'Onaylandı'
      case 'CANCELLED': return 'İptal Edildi'
      case 'COMPLETED': return 'Tamamlandı'
      default: return status
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Hoş geldiniz, {user?.name}
          </h1>
          <p className="text-gray-600">Hesap panelinizden randevularınızı görüntüleyebilir ve mesajlarınızı kontrol edebilirsiniz.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/appointment" className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-gray-200">
            <div className="text-gray-600 text-3xl mb-3">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Yeni Randevu</h3>
            <p className="text-gray-600 text-sm">Randevu almak için tıklayın</p>
          </Link>

          <Link href="/messages" className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-gray-200">
            <div className="text-gray-600 text-3xl mb-3">💬</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Mesajlar</h3>
            <p className="text-gray-600 text-sm">
              {messages.filter(m => !m.read).length} mesaj
            </p>
          </Link>

          <Link href="/contact" className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-gray-200">
            <div className="text-gray-600 text-3xl mb-3">📞</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">İletişim</h3>
            <p className="text-gray-600 text-sm">Bize ulaşın</p>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Appointments */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-medium text-gray-900">Randevularım</h2>
              <button
                onClick={fetchUserData}
                className="text-black hover:underline text-sm font-bold"
              >
                🔄 Yenile
              </button>
            </div>
            <div className="p-6">
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="border border-gray-100 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{appointment.service}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        📅 {new Date(appointment.date).toLocaleDateString('tr-TR')} - {appointment.time}
                      </p>
                      <p className="text-sm text-gray-600">
                        📧 {appointment.email}
                      </p>
                      {appointment.phone && (
                        <p className="text-sm text-gray-600">
                          📞 {appointment.phone}
                        </p>
                      )}
                      {appointment.notes && (
                        <p className="text-sm text-gray-500 mt-2 italic">
                          💬 {appointment.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-4">📅</div>
                  <p className="text-gray-600">Henüz randevunuz bulunmuyor</p>
                  <Link href="/appointment" className="inline-block mt-4 text-black hover:underline font-bold">
                    İlk randevunuzu alın →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Messages */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-medium text-gray-900">Son Mesajlar</h2>
              <button
                onClick={fetchUserData}
                className="text-black hover:underline text-sm font-bold"
              >
                🔄 Yenile
              </button>
            </div>
            <div className="p-6">
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.slice(0, 3).map((message) => (
                                          <div key={message.id} className={`border border-gray-100 rounded-lg p-4 ${!message.read ? 'bg-gray-50' : ''}`}>
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 text-sm">
                              {message.sender?.name ? message.sender.name.charAt(0).toUpperCase() : '👤'}
                            </span>
                          </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-sm font-medium text-gray-900">
                              {message.sender?.name || 'Bilinmeyen'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(message.createdAt).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                          <p className="text-gray-700 text-sm">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {messages.length > 3 && (
                                         <div className="text-center pt-4">
                       <Link href="/messages" className="text-black hover:underline text-sm font-bold">
                         Tüm mesajları gör ({messages.length}) →
                       </Link>
                     </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-4">💬</div>
                  <p className="text-gray-600">Henüz mesajınız bulunmuyor</p>
                  <Link href="/messages" className="inline-block mt-4 text-black hover:underline font-bold">
                    Doktora mesaj gönderin →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}