import React from 'react'
import { Menu } from 'lucide-react'
import './Topbar.css'

export function Topbar() {
  const toggleSidebar = () => {
    if (document && document.body) {
      document.body.classList.toggle('sidebar-open')
    }
  }

  return (
    <div className="topbar">
      <button className="hamburger" onClick={toggleSidebar} aria-label="Toggle menu">
        <Menu size={20} />
      </button>
      <div className="topbar-title">Mentora</div>
      <div className="topbar-spacer" />
    </div>
  )
}
