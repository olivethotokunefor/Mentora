// App.jsx
import React from 'react'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './contexts/AuthContext'
import { AuthForm } from './components/Auth/AuthForm'
import { Navbar } from './components/Layout/Navbar'
import { Topbar } from './components/Layout/Topbar'
import { HomePage } from './components/Home/HomePage'
import { ProfilePage } from './components/Profile/ProfilePage'
import { MiniGames } from './components/Games/MiniGames'
import { Dashboard } from './components/Dashboard/Dashboard'
import { AskQuestion } from './components/Ask/AskQuestion'
import { Feed } from './components/Feed/Feed'
import { Chat } from './components/Chat/Chat'
import { Messages } from './components/Messages/Messages'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

function AppContent() {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <>
      {currentUser && <Navbar />}
      {currentUser && <Topbar />}
      <div className={currentUser ? 'content-with-sidebar' : ''}>
      <Routes>
        {!currentUser && (
          <>
            <Route path="/auth" element={<AuthForm />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </>
        )}

        {currentUser && (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/games" element={<MiniGames />} />
            <Route path="/ask" element={<AskQuestion />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
      </div>
    </>
  )
}

function App() {
  return (
    <div className="app-container">
      <AppContent />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: 'var(--text)',
            borderRadius: '16px',
            padding: '16px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            fontWeight: '600'
          },
          success: {
            iconTheme: {
              primary: 'var(--primary)',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </div>
  )
}

export default App
