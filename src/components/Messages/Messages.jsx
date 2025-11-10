import React, { useState } from 'react'
import './Messages.css'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const mockThreads = [
  { id: '123', name: 'Alex (Design)', last: 'Happy to help with your portfolio!', time: '2h' },
  { id: '456', name: 'Priya (Frontend)', last: 'Try simplifying your component state.', time: '1d' },
]

export function Messages() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const filtered = mockThreads.filter(t => t.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="page page-messages">
      <header className="page-header">
        <h1>Messages</h1>
        <p className="page-subtitle">Continue your conversations anytime.</p>
      </header>

      <div className="messages-card">
        <div className="messages-header">
          <input
            className="search"
            placeholder="Search by name or topic…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="threads">
          {filtered.map((t) => (
            <motion.button
              key={t.id}
              className="thread"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => navigate(`/chat/${t.id}`)}
            >
              <div className="avatar" aria-hidden />
              <div className="thread-main">
                <div className="thread-top">
                  <div className="name">{t.name}</div>
                  <div className="time">{t.time}</div>
                </div>
                <div className="last">{t.last}</div>
              </div>
            </motion.button>
          ))}
          {filtered.length === 0 && (
            <div className="empty">No messages found.</div>
          )}
        </div>
      </div>
    </div>
  )
}
