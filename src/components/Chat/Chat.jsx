import React, { useState } from 'react'
import './Chat.css'
import { useParams } from 'react-router-dom'

export function Chat() {
  const { id } = useParams()
  const [messages, setMessages] = useState([
    { id: 1, from: 'them', text: 'Hi! How can I help today?' },
  ])
  const [input, setInput] = useState('')

  const send = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    setMessages((prev) => [...prev, { id: Date.now(), from: 'me', text: input.trim() }])
    setInput('')
  }

  return (
    <div className="page page-chat">
      <header className="page-header">
        <h1>Chat</h1>
        <p className="page-subtitle">Session #{id}</p>
      </header>
      <div className="chat-card">
        <div className="chat-body">
          {messages.map((m) => (
            <div key={m.id} className={`bubble ${m.from === 'me' ? 'me' : 'them'}`}>{m.text}</div>
          ))}
        </div>
        <form className="chat-input" onSubmit={send}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button className="btn primary" type="submit">Send</button>
        </form>
      </div>
    </div>
  )
}
