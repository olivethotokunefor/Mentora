import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, MessageCircle, Sparkles, Award, ArrowRightCircle, Star, Heart, Gamepad2, X } from 'lucide-react'
import './HomePage.css'
import { useAuth } from '../../contexts/AuthContext'
import confetti from 'canvas-confetti'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const heroImg = "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
const testimonial1 = "https://randomuser.me/api/portraits/women/44.jpg"
const testimonial2 = "https://randomuser.me/api/portraits/men/32.jpg"

const availableTags = [
  'Career', 'Tech', 'Design', 'Business', 'Life', 'Learning',
  'Coding', 'Marketing', 'Writing', 'Health', 'Finance', 'Creativity'
]

export function HomePage() {
  const navigate = useNavigate()
  const { currentUser, profile: userProfile, updateProfile } = useAuth()
  const [questions, setQuestions] = useState([])
  const [showAskForm, setShowAskForm] = useState(false)
  const [questionTitle, setQuestionTitle] = useState('')
  const [questionContent, setQuestionContent] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [loading, setLoading] = useState(false)

  // Drag logic for ask button
  const [pos, setPos] = useState({ x: 40, y: 40 })
  const [dragging, setDragging] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e) => {
    setDragging(true)
    setOffset({
      x: e.clientX - pos.x,
      y: window.innerHeight - e.clientY - pos.y
    })
  }

  const handleMouseUp = () => setDragging(false)

  const handleMouseMove = (e) => {
    if (dragging) {
      setPos({
        x: e.clientX - offset.x,
        y: window.innerHeight - e.clientY - offset.y
      })
    }
  }

  React.useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging])

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  useEffect(() => {
    // No real-time questions yet without Firebase; keep empty list for now.
    setQuestions([])
  }, [])

  const handleAskQuestion = async (e) => {
    e.preventDefault()
    if (!userProfile || !currentUser) {
      toast.error('Please log in to ask a question')
      return
    }
    toast('Posting questions will be available soon!')
    setShowAskForm(false)
    setQuestionTitle('')
    setQuestionContent('')
    setSelectedTags([])
    confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } })
  }

  return (
    <div className="cozy-landing">
      {/* Hero Section */}
      <section className="cozy-hero">
        <div className="cozy-hero-content">
          <div className="cozy-hero-text">
            <h1>
              <span className="cozy-brand">Mentora</span>
              <br />
              <span className="cozy-headline">Mentorship Made Simple</span>
            </h1>
            <p className="cozy-subtext">
              Mentora is a safe, friendly space for instant mentorship and skill exchange.<br />
              Connect with mentors and peers, ask questions, chat in real time, earn rewards, and even play mini games while you wait for a match!
            </p>
            {!userProfile && (
              <div className="hero-actions">
                <motion.button 
                  className="cta-button primary"
                  onClick={() => navigate('/auth')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Free
                </motion.button>
                <motion.button 
                  className="cta-button secondary"
                  onClick={() => navigate('/auth')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  I'm a Mentor
                </motion.button>
              </div>
            )}
          </div>
          <div className="cozy-hero-img">
            <img src={heroImg} alt="Mentorship" className="img-real" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="cozy-features">
        <h2 className="section-title">Why Mentora?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <Users className="feature-icon" />
            <h3>Instant Connections</h3>
            <p>Find mentors and peers in seconds, no waiting.</p>
          </div>
          <div className="feature-card">
            <Sparkles className="feature-icon" />
            <h3>Skill Exchange</h3>
            <p>Share your expertise and learn new skills from others.</p>
          </div>
          <div className="feature-card">
            <MessageCircle className="feature-icon" />
            <h3>Real-Time Chat</h3>
            <p>Chat instantly with mentors and mentees, anytime.</p>
          </div>
          <div className="feature-card">
            <Award className="feature-icon" />
            <h3>Point-Based Rewards</h3>
            <p>Earn points for helping and unlock special badges.</p>
          </div>
          <div className="feature-card feature-games" onClick={() => navigate('/games')}>
            <Gamepad2 className="feature-icon" />
            <h3>Mini Games</h3>
            <p>Sharpen your mind and have fun. Try our mini games!</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="cozy-guide">
        <h2 className="section-title">How It Works</h2>
        <div className="guide-steps-large">
          <div className="guide-step-large">
            <div className="step-number">1</div>
            <ArrowRightCircle className="guide-icon" />
            <p><strong>Sign Up</strong><br />Create your free account in seconds</p>
          </div>
          <div className="guide-step-large">
            <div className="step-number">2</div>
            <MessageCircle className="guide-icon" />
            <p><strong>Post a Question</strong><br />Share what you need help with</p>
          </div>
          <div className="guide-step-large">
            <div className="step-number">3</div>
            <Users className="guide-icon" />
            <p><strong>Get Matched</strong><br />Connect with the right mentor</p>
          </div>
          <div className="guide-step-large">
            <div className="step-number">4</div>
            <Heart className="guide-icon" />
            <p><strong>Grow Together</strong><br />Learn, share, and succeed</p>
          </div>
        </div>
      </section>

      {/* Recent Questions Section */}
      {questions.length > 0 && (
        <section className="recent-questions">
          <h2 className="section-title">Recent Community Questions</h2>
          <div className="questions-list">
            {questions.map(q => (
              <motion.div 
                key={q.id} 
                className="question-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3>{q.title}</h3>
                <p>{q.content.substring(0, 100)}...</p>
                <div className="question-tags">
                  {q.tags?.map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>
                <div className="question-meta">
                  <span>By {q.username || 'Anonymous'}</span>
                  <span>{q.created_at.toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="cozy-testimonials">
        <h2 className="section-title">Success Stories</h2>
        <div className="testimonials-grid">
          <motion.div 
            className="testimonial-card"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <img src={testimonial1} alt="User" className="img-testimonial" />
            <p className="testimonial-text">
              "Mentora matched me with a mentor who helped me land my dream job! The guidance was invaluable."
            </p>
            <div className="testimonial-name">
              <Star className="star-icon" /> Alex, Product Designer
            </div>
          </motion.div>
          <motion.div 
            className="testimonial-card"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <img src={testimonial2} alt="User" className="img-testimonial" />
            <p className="testimonial-text">
              "I love sharing my skills and earning rewards. The community is amazing and the chat is so easy to use!"
            </p>
            <div className="testimonial-name">
              <Star className="star-icon" /> Priya, Frontend Mentor
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of learners and mentors already growing together</p>
          <div className="cta-buttons">
            <motion.button 
              className="cta-button primary large"
              onClick={() => onNavigate && onNavigate('auth')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Now - It's Free
            </motion.button>
            <motion.button 
              className="cta-button secondary large"
              onClick={() => setShowAskForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ask a Question
            </motion.button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="cozy-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <span className="cozy-brand">Mentora</span> &copy; {new Date().getFullYear()}
          </div>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
          </div>
          <div className="footer-socials">
            <a href="#" aria-label="Facebook">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="FB" className="img-social" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LN" className="img-social" />
            </a>
          </div>
        </div>
        <div className="footer-note">
          <span>Built with love for learners & mentors worldwide.</span>
          <span style={{ marginLeft: '1rem', color: 'var(--blue)' }}>Contact: support@mentora.com</span>
        </div>
      </footer>

      {/* Floating Ask Button */}
      {userProfile && (
        <motion.div
          className="floating-ask-btn-big"
          style={{ left: pos.x, bottom: pos.y }}
          onMouseDown={handleMouseDown}
          title="Ask a question"
          tabIndex={0}
          role="button"
          aria-label="Ask a question"
          onClick={() => setShowAskForm(true)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <MessageCircle size={40} />
        </motion.div>
      )}

      {/* Ask Question Modal */}
      <AnimatePresence>
        {showAskForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="ask-modal-overlay"
            onClick={() => setShowAskForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="ask-modal-card"
            >
              <button className="ask-popup-close" onClick={() => setShowAskForm(false)}>
                <X size={22} />
              </button>
              <h2 className="ask-modal-title">
                What's on your mind? 🤔
              </h2>
              <form onSubmit={handleAskQuestion} className="ask-modal-form">
                <div>
                  <label className="ask-modal-label">
                    Quick summary (what do you need help with?)
                  </label>
                  <input
                    type="text"
                    value={questionTitle}
                    onChange={(e) => setQuestionTitle(e.target.value)}
                    placeholder="e.g., How do I switch careers to UX design?"
                    className="ask-modal-input"
                    required
                  />
                </div>
                <div>
                  <label className="ask-modal-label">
                    Tell us more! (the more details, the better help you'll get)
                  </label>
                  <textarea
                    value={questionContent}
                    onChange={(e) => setQuestionContent(e.target.value)}
                    placeholder="Share your situation, what you've tried, what you're struggling with..."
                    rows={6}
                    className="ask-modal-textarea"
                    required
                  />
                </div>
                <div>
                  <label className="ask-modal-label">
                    Pick some tags (helps us find the right helper!) 🏷️
                  </label>
                  <div className="ask-modal-tags">
                    {availableTags.map((tag) => (
                      <motion.button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`ask-modal-tag-btn ${
                          selectedTags.includes(tag)
                            ? 'ask-modal-tag-selected'
                            : ''
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        #{tag}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div className="ask-modal-points">
                  💡 This will cost 1 point. You currently have {userProfile?.points ?? '--'} points!
                </div>
                <div className="ask-modal-actions">
                  <motion.button
                    type="button"
                    onClick={() => setShowAskForm(false)}
                    className="ask-modal-cancel"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Maybe Later
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={loading || selectedTags.length === 0}
                    className="ask-modal-submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? 'Posting...' : 'Ask the Community! 🚀'}
                  </motion.button>
                </div>
              </form>
              {loading && (
                <div className="ask-modal-waiting">
                  <p>Looking for your best mentor match...</p>
                  <motion.button
                    className="ask-modal-games"
                    onClick={() => {
                      setShowAskForm(false)
                      navigate('/games')
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Gamepad2 size={20} style={{ marginRight: 6 }} />
                    Play Mini Games While You Wait
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}