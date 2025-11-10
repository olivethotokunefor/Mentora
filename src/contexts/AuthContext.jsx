import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi, usersApi } from '../lib/api'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [accessToken, setAccessToken] = useState(null)

  const formatError = (error) => {
    const code = error.code || ''
    if (code.includes('email-already-in-use')) return 'Email already in use.'
    if (code.includes('invalid-email')) return 'Invalid email address.'
    if (code.includes('weak-password')) return 'Password too weak.'
    if (code.includes('user-not-found')) return 'User not found.'
    if (code.includes('wrong-password')) return 'Incorrect password.'
    return 'Something went wrong. Try again.'
  }

  const fetchMe = async (token) => {
    const me = await authApi.me(token)
    setCurrentUser(me?.user || null)
    const p = await usersApi.getMe(token)
    setProfile(p || null)
  }

  const signup = async (email, password, userData) => {
    try {
      await authApi.register({ email, password, username: userData.username })
      const { accessToken } = await authApi.login({ email, password })
      setAccessToken(accessToken)
      await fetchMe(accessToken)
      return { email }
    } catch (error) {
      console.error('Error signing up:', error)
      throw new Error(formatError(error))
    }
  }

  const login = async (email, password) => {
    try {
      const { accessToken } = await authApi.login({ email, password })
      setAccessToken(accessToken)
      await fetchMe(accessToken)
      return { email }
    } catch (error) {
      console.error('Error logging in:', error)
      throw new Error(formatError(error))
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
      setAccessToken(null)
      setCurrentUser(null)
      setProfile(null)
    } catch (error) {
      console.error('Error logging out:', error)
      throw new Error(formatError(error))
    }
  }

  const updateProfile = async (updates) => {
    if (!currentUser) throw new Error('No user logged in')
    try {
      const updated = await usersApi.updateMe(updates, accessToken)
      setProfile(updated)
    } catch (error) {
      console.error('Error updating profile:', error)
      throw new Error(formatError(error))
    }
  }

  useEffect(() => {
    let cancelled = false
    async function init() {
      try {
        // try refresh to obtain access token from httpOnly cookie
        const { accessToken } = await authApi.refresh()
        if (cancelled) return
        setAccessToken(accessToken)
        await fetchMe(accessToken)
      } catch (_e) {
        // not logged in
        setCurrentUser(null)
        setProfile(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    init()
    return () => {
      cancelled = true
    }
  }, [])

  const value = {
    currentUser,
    profile,
    loading,
    signup,
    login,
    logout,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
