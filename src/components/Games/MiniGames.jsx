import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Target, Circle, Award, Smile, Brain, Puzzle, Dice5, Music2, BookOpen, Gamepad2 } from 'lucide-react'
import confetti from 'canvas-confetti'
import './MiniGames.css'

const gamesList = [
  {
    key: 'bubbles',
    title: 'Bubble Pop',
    description: 'Pop all the bubbles before time runs out!',
    icon: <Circle className="icon" />,
    color: 'bubble-card',
    component: BubblePopGame
  },
  {
    key: 'trivia',
    title: 'Quick Trivia',
    description: 'Test your random knowledge in 60 seconds!',
    icon: <Target className="icon" />,
    color: 'trivia-card',
    component: TriviaGame
  },
  {
    key: 'emoji',
    title: 'Emoji Memory',
    description: 'Match pairs of emojis as fast as you can!',
    icon: <Smile className="icon" />,
    color: 'emoji-card',
    component: EmojiMemoryGame
  },
  {
    key: 'brain',
    title: 'Brain Teasers',
    description: 'Solve tricky riddles and puzzles!',
    icon: <Brain className="icon" />,
    color: 'brain-card',
    component: BrainTeaserGame
  },
  {
    key: 'puzzle',
    title: 'Word Puzzle',
    description: 'Unscramble words before time runs out!',
    icon: <Puzzle className="icon" />,
    color: 'puzzle-card',
    component: WordPuzzleGame
  },
  {
    key: 'dice',
    title: 'Lucky Dice',
    description: 'Roll the dice and test your luck!',
    icon: <Dice5 className="icon" />,
    color: 'dice-card',
    component: DiceGame
  },
  {
    key: 'music',
    title: 'Music Quiz',
    description: 'Guess the song from a short clue!',
    icon: <Music2 className="icon" />,
    color: 'music-card',
    component: MusicQuizGame
  },
  {
    key: 'story',
    title: 'Story Builder',
    description: 'Build a story one sentence at a time!',
    icon: <BookOpen className="icon" />,
    color: 'story-card',
    component: StoryBuilderGame
  },
  {
    key: 'reaction',
    title: 'Reaction Speed',
    description: 'How fast can you click? Test your reflexes!',
    icon: <Zap className="icon" />,
    color: 'reaction-card',
    component: ReactionSpeedGame
  },
  {
    key: 'classic',
    title: 'Classic Arcade',
    description: 'Play a classic mini arcade game!',
    icon: <Gamepad2 className="icon" />,
    color: 'classic-card',
    component: ClassicArcadeGame
  }
]

export function MiniGames() {
  const [currentGame, setCurrentGame] = useState('select')
  const [score, setScore] = useState(0)

  const handleBack = () => {
    setCurrentGame('select')
    setScore(0)
  }

  return (
    <div className="minigames-container cozy-landing">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="minigames-header text-center mb-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="inline-flex items-center gap-3 mb-4 justify-center"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-sage-400 to-sage-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-sage-700 font-nunito">
              Fun Zone! 🎮
            </h1>
          </motion.div>
          <p className="text-xl text-sage-600 mb-8 font-medium">
            Quick games to keep you entertained while waiting for matches!
          </p>
        </motion.div>

        {currentGame === 'select' && (
          <div className="game-grid features-grid mb-8">
            {gamesList.map(game => (
              <GameCard
                key={game.key}
                title={game.title}
                description={game.description}
                icon={game.icon}
                color={game.color}
                onClick={() => setCurrentGame(game.key)}
              />
            ))}
          </div>
        )}

        {gamesList.map(game => (
          currentGame === game.key &&
          <game.component key={game.key} onBack={handleBack} onScore={setScore} />
        ))}
      </div>
    </div>
  )
}

function GameCard({ title, description, icon, color, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className={`game-card feature-card ${color}`}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="icon-wrapper">{icon}</div>
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
    </motion.button>
  )
}

// Bubble Pop Game
function BubblePopGame({ onBack, onScore }) {
  const [bubbles, setBubbles] = useState([])
  const [timeLeft, setTimeLeft] = useState(30)
  const [score, setLocalScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  React.useEffect(() => {
    const initialBubbles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 80,
      y: Math.random() * 70,
      popped: false
    }))
    setBubbles(initialBubbles)

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setGameOver(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const popBubble = (id) => {
    setBubbles(prev =>
      prev.map(bubble =>
        bubble.id === id ? { ...bubble, popped: true } : bubble
      )
    )
    setLocalScore(prev => prev + 10)
    onScore(score + 10)
  }

  const activeBubbles = bubbles.filter(b => !b.popped)

  React.useEffect(() => {
    if (activeBubbles.length === 0 && bubbles.length > 0) {
      setGameOver(true)
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
    }
  }, [activeBubbles.length, bubbles.length])

  return (
    <motion.div className="game-box">
      <div className="game-topbar">
        <motion.button onClick={onBack} className="back-btn">← Back</motion.button>
        <div className="stats">
          <div className="stat">
            <p>Score</p>
            <p>{score}</p>
          </div>
          <div className="stat">
            <p>Time</p>
            <p>{timeLeft}s</p>
          </div>
        </div>
      </div>

      <div className="bubble-field">
        <AnimatePresence>
          {bubbles.map(bubble => (
            !bubble.popped && (
              <motion.button
                key={bubble.id}
                onClick={() => popBubble(bubble.id)}
                className="bubble"
                style={{ left: `${bubble.x}%`, top: `${bubble.y}%` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
                exit={{ scale: 1.5, opacity: 0, rotate: 180 }}
                transition={{ y: { repeat: Infinity, duration: 2 + Math.random() }, exit: { duration: 0.3 } }}
              />
            )
          ))}
        </AnimatePresence>

        {gameOver && (
          <motion.div className="overlay">
            <div className="overlay-content">
              <Award className="overlay-icon" />
              <h3>{activeBubbles.length === 0 ? 'Perfect!' : 'Good Job!'}</h3>
              <p>Final Score: {score}</p>
              <button className="play-again" onClick={() => window.location.reload()}>
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// Trivia Game
function TriviaGame({ onBack, onScore }) {
  const questions = [
    { question: "What's the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Brisbane"], correct: 2 },
    { question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1 },
    { question: "What does 'HTTP' stand for?", options: ["HyperText Transfer Protocol", "Home Tool Transfer Protocol", "HyperText Tool Protocol", "Home Text Transfer Protocol"], correct: 0 },
    { question: "Which ocean is the largest?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: 3 },
    { question: "What year was JavaScript created?", options: ["1993", "1995", "1997", "1999"], correct: 1 },
  ]

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setLocalScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameOver, setGameOver] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setGameOver(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex)
    setShowResult(true)

    if (answerIndex === questions[currentQuestion].correct) {
      setLocalScore(prev => prev + 20)
      onScore(score + 20)
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        setGameOver(true)
      }
    }, 1500)
  }

  const current = questions[currentQuestion]

  return (
    <motion.div className="game-box">
      <div className="game-topbar">
        <motion.button onClick={onBack} className="back-btn">← Back</motion.button>
        <div className="stats">
          <div className="stat"><p>Score</p><p>{score}</p></div>
          <div className="stat"><p>Time</p><p>{timeLeft}s</p></div>
          <div className="stat"><p>Question</p><p>{currentQuestion + 1}/{questions.length}</p></div>
        </div>
      </div>

      {!gameOver ? (
        <div>
          <motion.h3 key={currentQuestion} className="question">{current.question}</motion.h3>
          <div className="options">
            {current.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => !showResult && handleAnswer(index)}
                disabled={showResult}
                className={`option ${showResult
                  ? index === current.correct
                    ? 'correct'
                    : selectedAnswer === index
                      ? 'wrong'
                      : 'disabled'
                  : ''}`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <div className="overlay-content">
          <Award className="overlay-icon" />
          <h3>Quiz Complete!</h3>
          <p>Final Score: {score} points</p>
          <p>You answered {Math.floor(score / 20)} out of {questions.length} questions correctly!</p>
          <button className="play-again" onClick={() => window.location.reload()}>
            Play Again
          </button>
        </div>
      )}
    </motion.div>
  )
}

// Emoji Memory Game
function EmojiMemoryGame({ onBack }) {
  const emojis = ['😀','😎','🥳','🤩','😇','😜','🤓','😱','😍','😡']
  const pairs = [...emojis.slice(0,5), ...emojis.slice(0,5)]
  const shuffled = useRef(pairs.sort(() => Math.random() - 0.5))
  const [flipped, setFlipped] = useState(Array(10).fill(false))
  const [matched, setMatched] = useState(Array(10).fill(false))
  const [first, setFirst] = useState(null)
  const [second, setSecond] = useState(null)
  const [moves, setMoves] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  React.useEffect(() => {
    if (matched.every(Boolean)) {
      setGameOver(true)
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
    }
  }, [matched])

  React.useEffect(() => {
    if (first !== null && second !== null) {
      setTimeout(() => {
        if (shuffled.current[first] === shuffled.current[second]) {
          setMatched(prev => {
            const arr = [...prev]
            arr[first] = true
            arr[second] = true
            return arr
          })
        }
        setFlipped(Array(10).fill(false))
        setFirst(null)
        setSecond(null)
      }, 900)
    }
  }, [first, second])

  const handleFlip = idx => {
    if (flipped[idx] || matched[idx] || first === idx || second === idx) return
    setFlipped(prev => {
      const arr = [...prev]
      arr[idx] = true
      return arr
    })
    if (first === null) setFirst(idx)
    else if (second === null) {
      setSecond(idx)
      setMoves(m => m + 1)
    }
  }

  return (
    <motion.div className="game-box">
      <div className="game-topbar">
        <motion.button onClick={onBack} className="back-btn">← Back</motion.button>
        <div className="stats">
          <div className="stat"><p>Moves</p><p>{moves}</p></div>
        </div>
      </div>
      <div className="emoji-grid">
        {shuffled.current.map((emoji, idx) => (
          <button
            key={idx}
            className={`emoji-card ${flipped[idx] || matched[idx] ? 'flipped' : ''}`}
            onClick={() => handleFlip(idx)}
            disabled={flipped[idx] || matched[idx] || gameOver}
          >
            {flipped[idx] || matched[idx] ? emoji : '❓'}
          </button>
        ))}
      </div>
      {gameOver && (
        <div className="overlay-content">
          <Smile className="overlay-icon" />
          <h3>All matched!</h3>
          <p>Total Moves: {moves}</p>
          <button className="play-again" onClick={() => window.location.reload()}>
            Play Again
          </button>
        </div>
      )}
    </motion.div>
  )
}

// Brain Teaser Game
function BrainTeaserGame({ onBack }) {
  const riddles = [
    { q: "What has keys but can't open locks?", a: "Keyboard" },
    { q: "What gets wetter as it dries?", a: "Towel" },
    { q: "What can travel around the world while staying in a corner?", a: "Stamp" },
    { q: "What has a heart that doesn’t beat?", a: "Artichoke" },
    { q: "What has hands but can’t clap?", a: "Clock" }
  ]
  const [current, setCurrent] = useState(0)
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    setShowResult(true)
    if (answer.trim().toLowerCase() === riddles[current].a.toLowerCase()) {
      setScore(s => s + 1)
    }
    setTimeout(() => {
      setShowResult(false)
      setAnswer('')
      if (current < riddles.length - 1) setCurrent(c => c + 1)
      else setGameOver(true)
    }, 1200)
  }

  return (
    <motion.div className="game-box">
      <div className="game-topbar">
        <motion.button onClick={onBack} className="back-btn">← Back</motion.button>
        <div className="stats">
          <div className="stat"><p>Score</p><p>{score}</p></div>
          <div className="stat"><p>Riddle</p><p>{current + 1}/{riddles.length}</p></div>
        </div>
      </div>
      {!gameOver ? (
        <form onSubmit={handleSubmit} className="riddle-form">
          <div className="riddle">{riddles[current].q}</div>
          <input
            type="text"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            className="riddle-input"
            placeholder="Your answer..."
            disabled={showResult}
            required
          />
          <button type="submit" className="riddle-btn" disabled={showResult}>Submit</button>
          {showResult && (
            <div className="riddle-result">
              {answer.trim().toLowerCase() === riddles[current].a.toLowerCase()
                ? "Correct!"
                : `Wrong! Answer: ${riddles[current].a}`}
            </div>
          )}
        </form>
      ) : (
        <div className="overlay-content">
          <Brain className="overlay-icon" />
          <h3>All riddles done!</h3>
          <p>Score: {score}/{riddles.length}</p>
          <button className="play-again" onClick={() => window.location.reload()}>
            Play Again
          </button>
        </div>
      )}
    </motion.div>
  )
}

// Word Puzzle Game
function WordPuzzleGame({ onBack }) {
  const words = ['mentor', 'design', 'career', 'growth', 'skills']
  const [current, setCurrent] = useState(0)
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const scrambled = words.map(w => w.split('').sort(() => Math.random() - 0.5).join(''))

  const handleSubmit = e => {
    e.preventDefault()
    setShowResult(true)
    if (input.trim().toLowerCase() === words[current]) {
      setScore(s => s + 1)
    }
    setTimeout(() => {
      setShowResult(false)
      setInput('')
      if (current < words.length - 1) setCurrent(c => c + 1)
      else setGameOver(true)
    }, 1200)
  }

  return (
    <motion.div className="game-box">
      <div className="game-topbar">
        <motion.button onClick={onBack} className="back-btn">← Back</motion.button>
        <div className="stats">
          <div className="stat"><p>Score</p><p>{score}</p></div>
          <div className="stat"><p>Puzzle</p><p>{current + 1}/{words.length}</p></div>
        </div>
      </div>
      {!gameOver ? (
        <form onSubmit={handleSubmit} className="riddle-form">
          <div className="riddle">Unscramble: <b>{scrambled[current]}</b></div>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="riddle-input"
            placeholder="Your answer..."
            disabled={showResult}
            required
          />
          <button type="submit" className="riddle-btn" disabled={showResult}>Submit</button>
          {showResult && (
            <div className="riddle-result">
              {input.trim().toLowerCase() === words[current]
                ? "Correct!"
                : `Wrong! Answer: ${words[current]}`}
            </div>
          )}
        </form>
      ) : (
        <div className="overlay-content">
          <Puzzle className="overlay-icon" />
          <h3>All puzzles done!</h3>
          <p>Score: {score}/{words.length}</p>
          <button className="play-again" onClick={() => window.location.reload()}>
            Play Again
          </button>
        </div>
      )}
    </motion.div>
  )
}

// Dice Game
function DiceGame({ onBack }) {
  const [roll, setRoll] = useState(null)
  const [score, setScore] = useState(0)
  const [rolls, setRolls] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const handleRoll = () => {
    if (rolls >= 10) return
    const val = Math.floor(Math.random() * 6) + 1
    setRoll(val)
    setScore(s => s + val)
    setRolls(r => r + 1)
    if (rolls + 1 === 10) setGameOver(true)
  }

  return (
    <motion.div className="game-box">
      <div className="game-topbar">
        <motion.button onClick={onBack} className="back-btn">← Back</motion.button>
        <div className="stats">
          <div className="stat"><p>Score</p><p>{score}</p></div>
          <div className="stat"><p>Rolls</p><p>{rolls}/10</p></div>
        </div>
      </div>
      <div className="dice-area">
        <div className="dice-display">{roll ? `🎲 ${roll}` : 'Roll the dice!'}</div>
        {!gameOver ? (
          <button className="dice-btn" onClick={handleRoll}>Roll</button>
        ) : (
          <div className="overlay-content">
            <Dice5 className="overlay-icon" />
            <h3>Game Over!</h3>
            <p>Total Score: {score}</p>
            <button className="play-again" onClick={() => window.location.reload()}>
              Play Again
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Music Quiz Game
function MusicQuizGame({ onBack }) {
  const questions = [
    { clue: "Queen's anthem about champions", answer: "We Are The Champions" },
    { clue: "Michael Jackson's moonwalk hit", answer: "Billie Jean" },
    { clue: "Adele's famous hello", answer: "Hello" }
  ]
  const [current, setCurrent] = useState(0)
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    setShowResult(true)
    if (input.trim().toLowerCase() === questions[current].answer.toLowerCase()) {
      setScore(s => s + 1)
    }
    setTimeout(() => {
      setShowResult(false)
      setInput('')
      if (current < questions.length - 1) setCurrent(c => c + 1)
      else setGameOver(true)
    }, 1200)
  }

  return (
    <motion.div className="game-box">
      <div className="game-topbar">
        <motion.button onClick={onBack} className="back-btn">← Back</motion.button>
        <div className="stats">
          <div className="stat"><p>Score</p><p>{score}</p></div>
          <div className="stat"><p>Song</p><p>{current + 1}/{questions.length}</p></div>
        </div>
      </div>
      {!gameOver ? (
        <form onSubmit={handleSubmit} className="riddle-form">
          <div className="riddle">Clue: <b>{questions[current].clue}</b></div>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="riddle-input"
            placeholder="Song name..."
            disabled={showResult}
            required
          />
          <button type="submit" className="riddle-btn" disabled={showResult}>Submit</button>
          {showResult && (
            <div className="riddle-result">
              {input.trim().toLowerCase() === questions[current].answer.toLowerCase()
                ? "Correct!"
                : `Wrong! Answer: ${questions[current].answer}`}
            </div>
          )}
        </form>
      ) : (
        <div className="overlay-content">
          <Music2 className="overlay-icon" />
          <h3>All songs done!</h3>
          <p>Score: {score}/{questions.length}</p>
          <button className="play-again" onClick={() => window.location.reload()}>
            Play Again
          </button>
        </div>
      )}
    </motion.div>
  )
}

// Story Builder Game
function StoryBuilderGame({ onBack }) {
  const [story, setStory] = useState([])
  const [input, setInput] = useState('')
  const [turn, setTurn] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const prompts = [
    "Once upon a time...",
    "Suddenly, a mysterious stranger appeared.",
    "The sky turned dark and...",
    "But then, hope returned when...",
    "In the end..."
  ]

  const handleSubmit = e => {
    e.preventDefault()
    setStory(s => [...s, input])
    setInput('')
    if (turn < prompts.length - 1) setTurn(t => t + 1)
    else setGameOver(true)
  }

  return (
    <motion.div className="game-box">
      <div className="game-topbar">
        <motion.button onClick={onBack} className="back-btn">← Back</motion.button>
        <div className="stats">
          <div className="stat"><p>Step</p><p>{turn + 1}/{prompts.length}</p></div>
        </div>
      </div>
      {!gameOver ? (
        <form onSubmit={handleSubmit} className="riddle-form">
          <div className="riddle">{prompts[turn]}</div>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="riddle-input"
            placeholder="Continue the story..."
            required
          />
          <button type="submit" className="riddle-btn">Add</button>
        </form>
      ) : (
        <div className="overlay-content">
          <BookOpen className="overlay-icon" />
          <h3>Your Story</h3>
          <div className="story-output">
            {story.map((line, idx) => (
              <div key={idx}><b>{prompts[idx]}</b> {line}</div>
            ))}
          </div>
          <button className="play-again" onClick={() => window.location.reload()}>
            Play Again
          </button>
        </div>
      )}
    </motion.div>
  )
}

// Reaction Speed Game
function ReactionSpeedGame({ onBack }) {
  const [started, setStarted] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [message, setMessage] = useState('Click Start to begin!')
  const [score, setScore] = useState(null)
  const timerRef = useRef(null)

  const startGame = () => {
    setStarted(true)
    setMessage('Wait for green...')
    setWaiting(true)
    const delay = Math.random() * 2000 + 1000
    timerRef.current = setTimeout(() => {
      setMessage('CLICK NOW!')
      setWaiting(false)
      timerRef.current = Date.now()
    }, delay)
  }

  const handleClick = () => {
    if (!started) return
    if (waiting) {
      setMessage('Too soon! Try again.')
      setStarted(false)
      setWaiting(false)
      clearTimeout(timerRef.current)
    } else if (typeof timerRef.current === 'number') {
      const reaction = Date.now() - timerRef.current
      setScore(reaction)
      setMessage(`Your reaction: ${reaction} ms`)
      setStarted(false)
      setWaiting(false)
    }
  }

  return (
    <motion.div className="game-box">
      <div className="game-topbar">
        <motion.button onClick={onBack} className="back-btn">← Back</motion.button>
      </div>
      <div className="reaction-area">
        <div className={`reaction-box ${started && !waiting ? 'go' : ''}`} onClick={handleClick}>
          <h3>{message}</h3>
          {score && <p>Try again for a better score!</p>}
        </div>
        {!started && (
          <button className="reaction-btn" onClick={startGame}>Start</button>
        )}
      </div>
    </motion.div>
  )
}

// Classic Arcade Game (Simple Snake)
function ClassicArcadeGame({ onBack }) {
  const gridSize = 10
  const [snake, setSnake] = useState([[5,5]])
  const [food, setFood] = useState([2,2])
  const [dir, setDir] = useState([0,1])
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const moveRef = useRef()

  React.useEffect(() => {
    moveRef.current = setInterval(() => {
      setSnake(prev => {
        if (gameOver) return prev
        const head = [prev[0][0] + dir[0], prev[0][1] + dir[1]]
        if (
          head[0] < 0 || head[0] >= gridSize ||
          head[1] < 0 || head[1] >= gridSize ||
          prev.some(([x,y]) => x === head[0] && y === head[1])
        ) {
          setGameOver(true)
          clearInterval(moveRef.current)
          return prev
        }
        let newSnake = [head, ...prev]
        if (head[0] === food[0] && head[1] === food[1]) {
          setScore(s => s + 1)
          setFood([
            Math.floor(Math.random() * gridSize),
            Math.floor(Math.random() * gridSize)
          ])
        } else {
          newSnake.pop()
        }
        return newSnake
      })
    }, 300)
    return () => clearInterval(moveRef.current)
  }, [dir, food, gameOver])

  React.useEffect(() => {
    const handleKey = e => {
      if (e.key === 'ArrowUp' && dir[0] !== 1) setDir([-1,0])
      if (e.key === 'ArrowDown' && dir[0] !== -1) setDir([1,0])
      if (e.key === 'ArrowLeft' && dir[1] !== 1) setDir([0,-1])
      if (e.key === 'ArrowRight' && dir[1] !== -1) setDir([0,1])
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [dir])

  return (
    <motion.div className="game-box">
      <div className="game-topbar">
        <motion.button onClick={onBack} className="back-btn">← Back</motion.button>
        <div className="stats">
          <div className="stat"><p>Score</p><p>{score}</p></div>
        </div>
      </div>
      <div className="snake-grid">
        {Array.from({ length: gridSize }).map((_, i) =>
          <div key={i} className="snake-row">
            {Array.from({ length: gridSize }).map((_, j) => {
              const isSnake = snake.some(([x,y]) => x === i && y === j)
              const isFood = food[0] === i && food[1] === j
              return (
                <div
                  key={j}
                  className={`snake-cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}
                />
              )
            })}
          </div>
        )}
      </div>
      {gameOver && (
        <div className="overlay-content">
          <Gamepad2 className="overlay-icon" />
          <h3>Game Over!</h3>
          <p>Score: {score}</p>
          <button className="play-again" onClick={() => window.location.reload()}>
            Play Again
          </button>
        </div>
      )}
    </motion.div>
  )
}