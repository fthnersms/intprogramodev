'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-light text-gray-900 tracking-wide">DYENT</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Public Links */}
            <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm">
              Ana Sayfa
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm">
              Hakkımızda
            </Link>
            <Link href="/services" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm">
              Hizmetler
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm">
              Blog
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm">
              İletişim
            </Link>

            {!isLoading && (
              <>
                {user ? (
                  // Authenticated user menu
                  <>
                    <div className="h-6 w-px bg-gray-200 mx-2"></div>
                    
                    {user.role === 'USER' && (
                      <Link href="/appointment" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm">
                        Randevu
                      </Link>
                    )}
                    {user.role === 'USER' && (
                      <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm">
                        Profilim
                      </Link>
                    )}
                    <Link href="/messages" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm">
                      Mesajlar
                    </Link>
                    
                    {user.role === 'ADMIN' && (
                      <Link href="/admin" className="bg-gradient-to-r from-red-100 to-red-200 text-red-900 px-4 py-2 rounded-lg font-medium transition-all text-sm hover:from-red-200 hover:to-red-300 shadow-sm">
                        👑 Yönetim
                      </Link>
                    )}

                    <div className="h-6 w-px bg-gray-200 mx-2"></div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">
                        {user.name.split(' ')[0]}
                      </span>
                      <button
                        onClick={handleLogout}
                        className="bg-red-50 text-red-700 px-4 py-2 rounded-lg font-medium transition-all text-sm hover:bg-red-100 border border-red-200 shadow-sm"
                      >
                        Çıkış
                      </button>
                    </div>
                  </>
                ) : (
                  // Non-authenticated user menu
                  <>
                    <div className="h-6 w-px bg-gray-200 mx-2"></div>
                    
                  
                    <Link 
                      href="/auth/login" 
                      className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium transition-all text-sm hover:bg-blue-100 border border-blue-200 shadow-sm"
                    >
                      Giriş
                    </Link>
                    <Link 
                      href="/auth/register" 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all font-medium text-sm shadow-md hover:shadow-lg"
                    >
                      Kayıt Ol
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none transition-transform duration-200 hover:scale-110"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
            <Link 
              href="/" 
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors hover:bg-gray-50 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Ana Sayfa
            </Link>
            <Link 
              href="/about" 
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors hover:bg-gray-50 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Hakkımızda
            </Link>
            <Link 
              href="/services" 
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors hover:bg-gray-50 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Hizmetler
            </Link>
            <Link 
              href="/blog" 
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors hover:bg-gray-50 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            <Link 
              href="/contact" 
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors hover:bg-gray-50 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              İletişim
            </Link>

            {!isLoading && (
              <>
                <div className="border-t border-gray-100 my-2"></div>
                
                {user ? (
                  // Mobile authenticated menu
                  <>
                                        <div className="px-3 py-2 text-sm text-gray-500">
                      Merhaba, {user.name}
                    </div>
                    
                    {user.role === 'USER' && (
                      <Link 
                        href="/appointment" 
                        className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors hover:bg-gray-50 rounded-lg"
                        onClick={() => setIsOpen(false)}
                      >
                        Randevu Al
                      </Link>
                    )}
                    {user.role === 'USER' && (
                      <Link 
                        href="/dashboard" 
                        className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors hover:bg-gray-50 rounded-lg"
                        onClick={() => setIsOpen(false)}
                      >
                        Profilim
                      </Link>
                    )}
                    <Link 
                      href="/messages" 
                      className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors hover:bg-gray-50 rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Mesajlar
                    </Link>
                    
                    {user.role === 'ADMIN' && (
                      <Link 
                        href="/admin" 
                        className="block mx-3 my-2 px-4 py-3 bg-gradient-to-r from-red-100 to-red-200 text-red-900 rounded-lg font-medium hover:from-red-200 hover:to-red-300 transition-all shadow-sm"
                        onClick={() => setIsOpen(false)}
                      >
                        👑 Yönetim Paneli
                      </Link>
                    )}
                    
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsOpen(false)
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors hover:bg-gray-50 rounded-lg"
                    >
                      Çıkış Yap
                    </button>
                  </>
                ) : (
                  // Mobile non-authenticated menu
                  <>
                                          <Link 
                        href="/auth/login" 
                        className="block mx-3 my-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg text-center hover:from-emerald-600 hover:to-emerald-700 font-medium transition-all shadow-md"
                        onClick={() => setIsOpen(false)}
                      >
                        Randevu Al
                      </Link>
                    <Link 
                      href="/auth/login" 
                      className="block mx-3 my-2 px-4 py-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-center hover:bg-blue-100 font-medium transition-all shadow-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      Giriş Yap
                    </Link>
                    <Link 
                      href="/auth/register" 
                      className="block mx-3 my-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg text-center hover:from-purple-600 hover:to-purple-700 font-medium transition-all shadow-md"
                      onClick={() => setIsOpen(false)}
                    >
                      Kayıt Ol
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 