import React from 'react'
import { motion } from 'framer-motion'
import { Heart, LogOut, User, Sparkles, Home, List, MessageCircle, PlusCircle, Gamepad2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import './Navbar.css' // <-- custom CSS file
import { NavLink, useNavigate } from 'react-router-dom'

export function Navbar() {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="navbar"
    >
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <motion.div 
            className="logo"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="logo-icon">
              <Heart className="icon-white" />
            </div>
            <h1 className="logo-text">Mentora</h1>
          </motion.div>

          {/* Right side */}
          <div className="navbar-right">
            <div className="points">
              <Sparkles className="points-icon" />
              <span className="points-text">
                {profile?.points || 0} points
              </span>
            </div>

            <div className="buttons">
              <NavLink to="/" end className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
                <Home size={18} /> <span className="label">Home</span>
              </NavLink>
              <NavLink to="/feed" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
                <List size={18} /> <span className="label">Feed</span>
              </NavLink>
              <NavLink to="/messages" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
                <MessageCircle size={18} /> <span className="label">Messages</span>
              </NavLink>
              <NavLink to="/ask" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
                <PlusCircle size={18} /> <span className="label">Ask</span>
              </NavLink>
              <NavLink to="/games" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
                <Gamepad2 size={18} /> <span className="label">Games</span>
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
                <User className="btn-icon" /> <span className="label">Profile</span>
              </NavLink>

              {/* Logout button */}
              <motion.button
                onClick={logout}
                className="logout-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <LogOut className="btn-icon" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
