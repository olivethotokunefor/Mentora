import React from 'react'
import './Feed.css'
import { motion } from 'framer-motion'

export function Feed() {
  const items = [] // TODO: replace with backend questions feed
  return (
    <div className="page page-feed">
      <header className="page-header">
        <h1>Community Feed</h1>
        <p className="page-subtitle">Browse recent questions and find something to help with.</p>
      </header>
      {items.length === 0 && (
        <div className="empty">
          <p>No questions yet. Be the first to ask or check back soon!</p>
        </div>
      )}
      <div className="feed-list">
        {items.map((q) => (
          <motion.div key={q.id} className="card feed-item" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="feed-title">{q.title}</div>
            <div className="feed-content">{q.content}</div>
            <div className="feed-tags">
              {q.tags?.map((t) => (
                <span key={t} className="tag">#{t}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
