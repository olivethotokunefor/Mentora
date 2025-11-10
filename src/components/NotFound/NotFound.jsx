import React from 'react'
import './NotFound.css'
import { useNavigate } from 'react-router-dom'

export function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="page page-notfound">
      <div className="card">
        <h1>Page not found</h1>
        <p>We couldn't find what you were looking for.</p>
        <div className="actions">
          <button className="btn" onClick={() => navigate(-1)}>Go Back</button>
          <button className="btn primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
        </div>
      </div>
    </div>
  )
}
