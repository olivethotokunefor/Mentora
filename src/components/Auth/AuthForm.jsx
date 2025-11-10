import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, Smile, Stars } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './AuthForm.css';

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signup(email, password, { username: email.split('@')[0] });
        toast.success('Welcome to the CozyMentor family! 🌱');
      } else {
        await login(email, password);
        toast.success('Welcome back! 🎉');
      }
      navigate('/dashboard'); // redirect after success
    } catch (error) {
      toast.error(error.message || 'Oops! Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="auth-container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="auth-card-wrapper"
        >
          {/* Header */}
          <motion.div
            className="auth-header"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="auth-header-content">
              <motion.div
                className="auth-logo"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              >
                <Heart className="auth-logo-icon" />
              </motion.div>
              <div>
                <h1 className="auth-title">CozyMentor</h1>
                <p className="auth-subtitle">Where knowledge meets kindness</p>
              </div>
            </div>
          </motion.div>

          {/* Main Form */}
          <motion.div
            className="auth-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="auth-welcome">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="auth-welcome-icons"
              >
                <Smile className="auth-icon-smile" />
                <h2 className="auth-heading">
                  {isSignUp
                    ? 'Join our cozy community!'
                    : 'Welcome back, friend!'}
                </h2>
                <Stars className="auth-icon-stars" />
              </motion.div>
              <p className="auth-desc">
                {isSignUp
                  ? 'Ready to share some knowledge and make new friends?'
                  : "Let's continue spreading those good vibes!"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Email */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label className="auth-label">Email Address</label>
                <div className="auth-input-wrapper">
                  <Mail className="auth-input-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label className="auth-label">Password</label>
                <div className="auth-input-wrapper">
                  <Lock className="auth-input-icon" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="auth-btn-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="auth-spinner"
                  />
                ) : isSignUp ? (
                  'Start My Journey! 🌱'
                ) : (
                  "Let's Go! 🎉"
                )}
              </motion.button>

              {/* Google Sign-in removed */}
            </form>

            {/* Toggle SignIn / SignUp */}
            <motion.div
              className="auth-toggle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="auth-toggle-btn"
              >
                {isSignUp
                  ? 'Already part of the family? Welcome back!'
                  : 'New here? Join our cozy community!'}
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
