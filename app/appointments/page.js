'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AppointmentsPage() {
  const [user, setUser] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewAppointment, setShowNewAppointment] = useState(false)
  const [newAppointment, setNewAppointment] = useState({
    date: '',
    time: '',
    service: '',
    notes: ''
  })

  useEffect(() => {
    fetchUserData()
    fetchAppointments()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const fetchAppointments = async () => {
    try {
      // Şimdilik örnek veriler, sonra API'den alınacak
      setAppointments([
        {
          id: 1,
          date: '2024-06-15',
          time: '10:00',
          service: 'Genel Kontrol',
          status: 'PENDING',
          notes: 'Rutin diş kontrolü'
        },
        {
          id: 2,
          date: '2024-06-08',
          time: '14:30',
          service: 'Diş Temizliği',
          status: 'COMPLETED',
          notes: 'Tamamlandı'
        }
      ])
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewAppointment = (e) => {
    setNewAppointment({
      ...newAppointment,
      [e.target.name]: e.target.value
    })
  }

  const submitAppointment = async (e) => {
    e.preventDefault()
    // API call will be implemented later
    alert('Randevu talebiniz alındı! En kısa sürede size dönüş yapılacaktır.')
    setShowNewAppointment(false)
    setNewAppointment({ date: '', time: '', service: '', notes: '' })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-white text-black border border-gray-400'
      case 'APPROVED': return 'bg-gray-700 text-white'
      case 'COMPLETED': return 'bg-black text-white'
      case 'CANCELLED': return 'bg-gray-300 text-black'
      default: return 'bg-white text-black border border-gray-400'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Beklemede'
      case 'APPROVED': return 'Onaylandı'
      case 'COMPLETED': return 'Tamamlandı'
      case 'CANCELLED': return 'İptal Edildi'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Randevular yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Randevularım
            </h1>
            <p className="text-gray-600 mt-2">
              Mevcut randevularınızı görüntüleyin ve yeni randevu alın.
            </p>
          </div>
          <button
            onClick={() => setShowNewAppointment(true)}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            + Yeni Randevu
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📅</div>
              <div>
                <p className="text-sm text-gray-600">Toplam Randevu</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="text-3xl mr-4">⏳</div>
              <div>
                <p className="text-sm text-gray-600">Beklemede</p>
                <p className="text-2xl font-bold text-gray-600">
                  {appointments.filter(a => a.status === 'PENDING').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="text-3xl mr-4">✅</div>
              <div>
                <p className="text-sm text-gray-600">Onaylandı</p>
                <p className="text-2xl font-bold text-gray-600">
                  {appointments.filter(a => a.status === 'APPROVED').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🏁</div>
              <div>
                <p className="text-sm text-gray-600">Tamamlandı</p>
                <p className="text-2xl font-bold text-gray-600">
                  {appointments.filter(a => a.status === 'COMPLETED').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Randevu Geçmişi</h2>
          </div>
          
          {appointments.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">📅</div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {appointment.service}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(appointment.date).toLocaleDateString('tr-TR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })} • {appointment.time}
                        </p>
                        {appointment.notes && (
                          <p className="text-sm text-gray-500 mt-1">{appointment.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </span>
                      {appointment.status === 'PENDING' && (
                        <button className="text-black hover:underline text-sm font-bold">
                          İptal Et
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Henüz randevunuz yok
              </h3>
              <p className="text-gray-600 mb-6">
                Diş sağlığınız için hemen randevu alın
              </p>
              <button
                onClick={() => setShowNewAppointment(true)}
                className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                İlk Randevunu Al
              </button>
            </div>
          )}
        </div>

        {/* New Appointment Modal */}
        {showNewAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Yeni Randevu Al</h3>
              </div>
              
              <form onSubmit={submitAppointment} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tarih *
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={newAppointment.date}
                    onChange={handleNewAppointment}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Saat *
                  </label>
                  <select
                    name="time"
                    required
                    value={newAppointment.time}
                    onChange={handleNewAppointment}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    <option value="">Saat seçin</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hizmet *
                  </label>
                  <select
                    name="service"
                    required
                    value={newAppointment.service}
                    onChange={handleNewAppointment}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    <option value="">Hizmet seçin</option>
                    <option value="Genel Kontrol">Genel Kontrol</option>
                    <option value="Diş Temizliği">Diş Temizliği</option>
                    <option value="Dolgu">Dolgu</option>
                    <option value="Kanal Tedavisi">Kanal Tedavisi</option>
                    <option value="Diş Çekimi">Diş Çekimi</option>
                    <option value="Estetik Diş Hekimliği">Estetik Diş Hekimliği</option>
                    <option value="Ortodonti">Ortodonti</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notlar
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    value={newAppointment.notes}
                    onChange={handleNewAppointment}
                    placeholder="Özel bir durumunuz varsa belirtiniz..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewAppointment(false)}
                    className="flex-1 px-4 py-2 border-2 border-gray-500 text-black rounded-md hover:bg-gray-500 hover:text-white transition-colors font-medium"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Randevu Al
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 