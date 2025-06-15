'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function Messages() {
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [admins, setAdmins] = useState([])
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      loadMessages()
      loadAdmins()
    }
  }, [user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        router.push('/auth/login')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/messages')
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Messages load failed:', error)
    }
  }

  const loadAdmins = async () => {
    try {
      if (user.role === 'ADMIN') {
        // Admin - load users to chat with
        const response = await fetch('/api/users')
        if (response.ok) {
          const data = await response.json()
          setAdmins(data)
          if (data.length > 0) {
            setSelectedAdmin(data[0])
          }
        }
      } else {
        // User - load admins to chat with
        const response = await fetch('/api/admin/users')
        if (response.ok) {
          const data = await response.json()
          setAdmins(data)
          if (data.length > 0) {
            setSelectedAdmin(data[0])
          }
        }
      }
    } catch (error) {
      console.error('Admins load failed:', error)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedAdmin || sending) return

    setSending(true)
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage.trim(),
          receiverId: selectedAdmin.id
        })
      })

      if (response.ok) {
        const message = await response.json()
        setMessages(prev => [...prev, message])
        setNewMessage('')
      } else {
        console.error('Message send failed')
      }
    } catch (error) {
      console.error('Message send error:', error)
    } finally {
      setSending(false)
    }
  }

  const getConversationMessages = () => {
    if (!selectedAdmin || !user) return []
    
    return messages.filter(message => 
      (message.senderId === user.id && message.receiverId === selectedAdmin.id) ||
      (message.senderId === selectedAdmin.id && message.receiverId === user.id)
    )
  }

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

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-[600px] flex">
          {/* Sidebar - Admin List */}
          <div className="w-1/3 border-r border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {user.role === 'ADMIN' ? 'Kullanıcılar' : 'Destek'}
              </h2>
            </div>
            
            <div className="overflow-y-auto h-full">
              {admins.map((person) => (
                <div
                  key={person.id}
                  onClick={() => setSelectedAdmin(person)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-50 ${
                    selectedAdmin?.id === person.id ? 'bg-gray-50 border-gray-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-semibold text-sm">
                        {person.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{person.name}</p>
                      <p className="text-sm text-gray-500">
                        {user.role === 'ADMIN' ? 'Hasta' : 'Doktor'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {admins.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  {user.role === 'ADMIN' ? 'Henüz kullanıcı yok' : 'Henüz doktor yok'}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedAdmin ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-semibold text-sm">
                        {selectedAdmin.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedAdmin.name}</p>
                      <p className="text-sm text-gray-600">Çevrimiçi</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {getConversationMessages().map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === user.id
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === user.id ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          {new Date(message.createdAt).toLocaleTimeString('tr-TR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-100">
                  <form onSubmit={sendMessage} className="flex space-x-4">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Mesajınızı yazın..."
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? 'Gönderiliyor...' : 'Gönder'}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p>Mesajlaşmaya başlamak için bir kişi seçin</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 