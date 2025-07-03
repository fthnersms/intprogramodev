'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPanel() {
  const [user, setUser] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState('appointments')
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    todayAppointments: 0,
    totalUsers: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const router = useRouter()

  useEffect(() => {
    checkAdminAuth()
    fetchAdminData()
  }, [])

  // Auto refresh data every 30 seconds for real-time updates
  useEffect(() => {
    if (!user || user.role !== 'ADMIN') return

    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing admin data...')
      fetchAdminData(true) // Show loading indicator for manual refresh
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [user])

  const checkAdminAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/auth/login')
        return
      }
      const userData = await response.json()
      if (userData.role !== 'ADMIN') {
        router.push('/dashboard')
        return
      }
      setUser(userData)
    } catch (error) {
      router.push('/auth/login')
    }
  }

  const fetchAdminData = async (showLoading = false) => {
    try {
      if (showLoading) setIsUpdating(true)
      
      // Fetch real appointments from API
      const appointmentsResponse = await fetch('/api/appointments')
      const appointmentsData = appointmentsResponse.ok ? await appointmentsResponse.json() : []
      
      // Fetch all users from API
      const usersResponse = await fetch('/api/admin/users')
      const usersData = usersResponse.ok ? await usersResponse.json() : []

      setAppointments(appointmentsData)
      setUsers(usersData)
      
      // Calculate stats from real data
      const today = new Date().toDateString()
      
      setStats({
        totalAppointments: appointmentsData.length,
        pendingAppointments: appointmentsData.filter(a => a.status === 'PENDING').length,
        todayAppointments: appointmentsData.filter(a => 
          new Date(a.date).toDateString() === today
        ).length,
        totalUsers: usersData.length
      })
      
      setLastUpdated(new Date())
      
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setIsLoading(false)
      setIsUpdating(false)
    }
  }

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      console.log('Updating appointment:', { appointmentId, newStatus })
      
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      console.log('Response status:', response.status)
      
      if (response.ok) {
        const updatedAppointment = await response.json()
        console.log('Appointment updated successfully:', updatedAppointment)
        
        // Update appointments in state
        setAppointments(prev => 
          prev.map(app => 
            app.id === appointmentId 
              ? { ...app, status: newStatus }
              : app
          )
        )
        
        // Recalculate stats dynamically
        const updatedAppointments = appointments.map(app => 
          app.id === appointmentId ? { ...app, status: newStatus } : app
        )
        
        const today = new Date().toDateString()
        
        setStats({
          totalAppointments: updatedAppointments.length,
          pendingAppointments: updatedAppointments.filter(a => a.status === 'PENDING').length,
          todayAppointments: updatedAppointments.filter(a => 
            new Date(a.date).toDateString() === today
          ).length,
          totalUsers: users.length
        })
      } else {
        const errorData = await response.json()
        console.error('Failed to update appointment:', response.status, errorData)
        alert(`Randevu güncellenemedi: ${errorData.error || 'Bilinmeyen hata'}`)
      }
    } catch (error) {
      console.error('Failed to update appointment:', error)
      alert('Randevu güncellenirken bir hata oluştu')
    }
  }

  const clearDatabase = async () => {
    if (!confirm('⚠️ DİKKAT! Bu işlem TÜM VERİTABANINI temizleyecek!\n\n- Tüm randevular silinecek\n- Tüm mesajlar silinecek\n- Tüm kullanıcılar silinecek\n\nBu işlem GERİ ALINAMAZ!\n\nDevam etmek istediğinizden emin misiniz?')) {
      return
    }

    if (!confirm('Son kez soruyorum: TÜM VERİTABANINI silmek istediğinizden EMİN MİSİNİZ?')) {
      return
    }

    try {
      const response = await fetch('/api/admin/clear-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Database cleared successfully:', result)
        alert(`✅ Veritabanı başarıyla temizlendi!\n\n📊 Silinen veriler:\n• ${result.deleted?.userMessages || 0} kullanıcı mesajı\n• ${result.deleted?.contactMessages || 0} iletişim mesajı\n• ${result.deleted?.appointments || 0} randevu\n• ${result.deleted?.users || 0} kullanıcı`)
        // Reload data
        fetchAdminData(true)
      } else {
        let errorData
        try {
          errorData = await response.json()
        } catch (e) {
          errorData = { error: 'Sunucu yanıtı alınamadı' }
        }
        console.error('Failed to clear database:', response.status, errorData)
        alert(`❌ Veritabanı temizlenemedi!\n\nHata: ${errorData.error || 'Bilinmeyen hata'}\nDurum Kodu: ${response.status}`)
      }
    } catch (error) {
      console.error('Failed to clear database:', error)
      alert('❌ Veritabanı temizlenirken bir hata oluştu')
    }
  }

  const markMessageAsRead = async (messageId) => {
    try {
      const response = await fetch(`/api/messages/${messageId}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        // Update message state
        const updatedMessages = messages.map(msg => 
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
        setMessages(updatedMessages)
        
        // Update unread messages count dynamically
        const unreadMessages = updatedMessages.filter(msg => !msg.isRead).length
        setStats(prev => ({
          ...prev,
          unreadMessages: unreadMessages
        }))
      } else {
        console.error('Failed to mark message as read')
      }
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole })
      })

      const data = await response.json()

      if (response.ok) {
        // Update users state
        setUsers(prev => 
          prev.map(user => 
            user.id === userId 
              ? { ...user, role: newRole }
              : user
          )
        )
        alert(`✅ ${data.message}`)
      } else {
        alert(`❌ ${data.error}`)
      }
    } catch (error) {
      console.error('Failed to update user role:', error)
      alert('❌ Rol güncellenirken bir hata oluştu')
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

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800 border border-red-200'
      case 'DOCTOR': return 'bg-blue-100 text-blue-800 border border-blue-200'
      case 'USER': return 'bg-gray-100 text-gray-800 border border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  const getRoleText = (role) => {
    switch (role) {
      case 'ADMIN': return 'Admin'
      case 'DOCTOR': return 'Doktor'
      case 'USER': return 'Hasta'
      default: return role
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
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-light text-gray-900 mb-2">
              Yönetim Paneli
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-gray-600">Randevuları yönetin ve hasta mesajlarını kontrol edin.</p>
              {lastUpdated && (
                <div className="text-sm text-gray-500">
                  Son güncelleme: {lastUpdated.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3 self-start sm:self-auto">
            <button
              onClick={() => fetchAdminData(true)}
              disabled={isUpdating}
              className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                isUpdating 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              {isUpdating ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  Güncelleniyor...
                </div>
              ) : (
                '🔄 Yenile'
              )}
            </button>
            <button
              onClick={clearDatabase}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              🗑️ Veritabanını Temizle
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 relative">
            <div className="text-gray-600 text-3xl mb-3">📅</div>
            <h3 className="text-2xl font-light text-gray-900">{stats.totalAppointments}</h3>
            <p className="text-gray-600 text-sm">Toplam Randevu</p>
            {isUpdating && (
              <div className="absolute top-2 right-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-gray-600 text-3xl mb-3">⏳</div>
            <h3 className="text-2xl font-light text-gray-900">{stats.pendingAppointments}</h3>
            <p className="text-gray-600 text-sm">Bekleyen Randevu</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-gray-600 text-3xl mb-3">📋</div>
            <h3 className="text-2xl font-light text-gray-900">{stats.todayAppointments}</h3>
            <p className="text-gray-600 text-sm">Bugünkü Randevu</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-gray-600 text-3xl mb-3">👥</div>
            <h3 className="text-2xl font-light text-gray-900">{stats.totalUsers}</h3>
            <p className="text-gray-600 text-sm">Toplam Kullanıcı</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'appointments'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📅 Randevular ({stats.totalAppointments})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              👥 Kullanıcı Yönetimi ({stats.totalUsers})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'appointments' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-medium text-gray-900">Randevular</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hasta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih & Saat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hizmet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      <div className="text-4xl mb-2">📅</div>
                      <p>Henüz randevu bulunmuyor</p>
                    </td>
                  </tr>
                ) : (
                  appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{appointment.name}</div>
                        <div className="text-sm text-gray-500">{appointment.email}</div>
                        <div className="text-sm text-gray-500">{appointment.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(appointment.date).toLocaleDateString('tr-TR')}
                      </div>
                      <div className="text-sm text-gray-500">{appointment.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.service}</div>
                      {appointment.notes && (
                        <div className="text-sm text-gray-500">{appointment.notes}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        {appointment.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 'APPROVED')}
                              className="text-black font-medium border-2 border-gray-600 px-2 py-1 rounded text-xs hover:bg-gray-600 hover:text-white"
                            >
                              Onayla
                            </button>
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')}
                              className="text-black font-medium border-2 border-gray-600 px-2 py-1 rounded text-xs hover:bg-gray-600 hover:text-white"
                            >
                              İptal Et
                            </button>
                          </>
                        )}
                        {appointment.status === 'APPROVED' && (
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'COMPLETED')}
                            className="text-black font-medium border-2 border-gray-600 px-2 py-1 rounded text-xs hover:bg-gray-600 hover:text-white"
                          >
                            Tamamla
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* Users Management Section */}
        {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-medium text-gray-900">Kullanıcı Yönetimi</h2>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-600">Sadece admin kullanıcıları rol değişikliği yapabilir</p>
              <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200">
                🔒 <strong>Güvenlik:</strong> Admin yetkisi sadece sistem tarafından verilebilir. Başka admin oluşturamazsınız.
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İletişim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İstatistikler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      <div className="text-4xl mb-2">👥</div>
                      <p>Henüz kullanıcı bulunmuyor</p>
                    </td>
                  </tr>
                ) : (
                  users.map((userItem) => (
                  <tr key={userItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 font-medium text-sm">
                              {userItem.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{userItem.name}</div>
                          <div className="text-sm text-gray-500">
                            Kayıt: {new Date(userItem.createdAt).toLocaleDateString('tr-TR')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{userItem.email}</div>
                      <div className="text-sm text-gray-500">{userItem.phone || 'Telefon yok'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(userItem.role)}`}>
                        {getRoleText(userItem.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>📅 {userItem._count?.appointments || 0} randevu</div>
                      <div>💬 {(userItem._count?.sentMessages || 0) + (userItem._count?.receivedMessages || 0)} mesaj</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                             {userItem.id !== user?.id ? (
                         <div className="flex space-x-2">
                           {userItem.role !== 'DOCTOR' && userItem.role !== 'ADMIN' && (
                             <button
                               onClick={() => updateUserRole(userItem.id, 'DOCTOR')}
                               className="text-blue-700 font-medium border-2 border-blue-200 px-2 py-1 rounded text-xs hover:bg-blue-100 bg-blue-50"
                             >
                               👨‍⚕️ Doktor Yap
                             </button>
                           )}
                           {userItem.role === 'DOCTOR' && (
                             <button
                               onClick={() => updateUserRole(userItem.id, 'USER')}
                               className="text-gray-700 font-medium border-2 border-gray-200 px-2 py-1 rounded text-xs hover:bg-gray-100 bg-gray-50"
                             >
                               👤 Hasta Yap
                             </button>
                           )}
                           {userItem.role === 'ADMIN' && (
                             <span className="text-red-400 text-xs">Admin yetkisi değiştirilemez</span>
                           )}
                         </div>
                       ) : (
                         <span className="text-gray-400 text-xs">Kendi rolünüzü değiştiremezsiniz</span>
                       )}
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>
    </div>
  )
} 