import React from 'react'
import './Dashboard.css'

export function Dashboard({ onNavigate }) {
  return (
    <div className="page page-dashboard">
      <header className="page-header">
        <h1>Welcome back 👋</h1>
        <p className="page-subtitle">Here’s a quick snapshot of your Mentora activity.</p>
      </header>

      <div className="grid">
        <section className="card kpi">
          <div className="kpi-title">Points</div>
          <div className="kpi-value">—</div>
        </section>
        <section className="card kpi">
          <div className="kpi-title">Open Questions</div>
          <div className="kpi-value">—</div>
        </section>
        <section className="card kpi">
          <div className="kpi-title">Active Chats</div>
          <div className="kpi-value">—</div>
        </section>
      </div>

      <div className="grid two">
        <section className="card">
          <div className="card-title">Quick Actions</div>
          <div className="quick-actions">
            <button className="btn" onClick={() => onNavigate && onNavigate('ask')}>Ask a Question</button>
            <button className="btn" onClick={() => onNavigate && onNavigate('feed')}>Browse Feed</button>
            <button className="btn" onClick={() => onNavigate && onNavigate('messages')}>Go to Messages</button>
          </div>
        </section>
        <section className="card">
          <div className="card-title">Tips</div>
          <ul className="tips">
            <li>Keep your question concise but detailed.</li>
            <li>Tag your question to get matched faster.</li>
            <li>Be kind and follow community guidelines.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
