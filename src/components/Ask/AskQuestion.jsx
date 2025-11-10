import React, { useState } from 'react'
import './AskQuestion.css'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export function AskQuestion() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)

  const addTag = () => {
    const t = tagInput.trim()
    if (!t) return
    if (tags.includes(t)) return toast('Tag already added')
    setTags((prev) => [...prev, t])
    setTagInput('')
  }

  const removeTag = (t) => setTags(tags.filter((x) => x !== t))

  const submit = async (e) => {
    e.preventDefault()
    if (!title || !content || tags.length === 0) {
      return toast.error('Please fill title, content and at least one tag')
    }
    setLoading(true)
    try {
      // TODO: POST to backend when questions API exists
      toast.success('Question submitted! You will be matched shortly ✨')
      setTitle('')
      setContent('')
      setTags([])
    } catch (e) {
      toast.error('Failed to submit question')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page page-ask">
      <header className="page-header">
        <h1>Ask a Question</h1>
        <p className="page-subtitle">Describe what you need help with and add tags to find the right mentor.</p>
      </header>

      <form className="card ask-form" onSubmit={submit}>
        <div className="field">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., How to switch careers to UX?" />
        </div>
        <div className="field">
          <label>Details</label>
          <textarea rows={6} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Explain your situation, what you tried, where you're stuck" />
        </div>
        <div className="field">
          <label>Tags</label>
          <div className="tags-row">
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add a tag and press Add" />
            <button type="button" className="btn" onClick={addTag}>Add</button>
          </div>
          <div className="tags-list">
            {tags.map((t) => (
              <motion.span key={t} className="tag" whileHover={{ scale: 1.05 }}>
                #{t}
                <button className="tag-x" type="button" onClick={() => removeTag(t)}>×</button>
              </motion.span>
            ))}
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn primary" type="submit" disabled={loading}>
          {loading ? 'Submitting…' : 'Submit Question'}
        </motion.button>
      </form>
    </div>
  )
}
