import { useEffect, useState } from 'react'
import './cie.css'

function Cie() {
  // State for user information
  const [firstName, setFirstName] = useState('')
  const [surname, setSurname] = useState('')
  
  // State for current time
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // State for feedback counts
  const [feedbackCounts, setFeedbackCounts] = useState({
    excellent: 0,
    good: 0,
    average: 0,
    poor: 0
  })
  
  // State for user's personal submission counter
  const [userSubmissionCount, setUserSubmissionCount] = useState(0)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Simulate real-time voting from other participants every 2 seconds
  useEffect(() => {
    const votingTimer = setInterval(() => {
      const feedbackOptions = ['excellent', 'good', 'average', 'poor']
      const randomOption = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)]
      
      setFeedbackCounts(prev => ({
        ...prev,
        [randomOption]: prev[randomOption] + 1
      }))
    }, 2000)

    return () => clearInterval(votingTimer)
  }, [])

  // Handle feedback submission
  const handleFeedbackSubmit = (feedbackType) => {
    setFeedbackCounts(prev => ({
      ...prev,
      [feedbackType]: prev[feedbackType] + 1
    }))
    setUserSubmissionCount(prev => prev + 1)
  }

  // Handle counter controls
  const handleCounterIncrement = () => {
    setUserSubmissionCount(prev => prev + 1)
  }

  const handleCounterDecrement = () => {
    setUserSubmissionCount(prev => Math.max(0, prev - 1))
  }

  const handleCounterReset = () => {
    setUserSubmissionCount(0)
  }

  const handleCounterIncrementByFive = () => {
    setUserSubmissionCount(prev => prev + 5)
  }

  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="dashboard">
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1>Live Event Feedback Dashboard</h1>
        </header>

        {/* Greeting Section */}
        <section className="greeting-section">
          <h2>Welcome</h2>
          <div className="name-inputs">
            <div className="input-group">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
              />
            </div>
            <div className="input-group">
              <label htmlFor="surname">Surname:</label>
              <input
                type="text"
                id="surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="Enter your surname"
              />
            </div>
          </div>
          {firstName && surname && (
            <div className="personalized-greeting">
              ➤ Welcome, {firstName} {surname} !
            </div>
          )}
        </section>

        {/* Live Clock */}
        <section className="clock-section">
          <h2>Current Time</h2>
          <div className="clock">
            {formatTime(currentTime)}
          </div>
        </section>

        {/* Feedback Voting Panel */}
        <section className="feedback-section">
          <h2>Session Feedback</h2>
          <div className="feedback-buttons">
            <button 
              className="feedback-btn excellent"
              onClick={() => handleFeedbackSubmit('excellent')}
            >
              Excellent
            </button>
            <button 
              className="feedback-btn good"
              onClick={() => handleFeedbackSubmit('good')}
            >
              Good
            </button>
            <button 
              className="feedback-btn average"
              onClick={() => handleFeedbackSubmit('average')}
            >
              Average
            </button>
            <button 
              className="feedback-btn poor"
              onClick={() => handleFeedbackSubmit('poor')}
            >
              Poor
            </button>
          </div>
          
          <div className="feedback-results">
            <h3>Live Results</h3>
            <div className="results-grid">
              <div className="result-item">
                <span className="result-label">Excellent:</span>
                <span className="result-count">{feedbackCounts.excellent}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Good:</span>
                <span className="result-count">{feedbackCounts.good}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Average:</span>
                <span className="result-count">{feedbackCounts.average}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Poor:</span>
                <span className="result-count">{feedbackCounts.poor}</span>
              </div>
            </div>
            <div className="total-feedback">
              <strong>Total Feedback: {feedbackCounts.excellent + feedbackCounts.good + feedbackCounts.average + feedbackCounts.poor}</strong>
            </div>
          </div>
        </section>

        {/* Counter Panel */}
        <section className="counter-section">
          <h2>Your Submission Counter</h2>
          <div className="counter-display">
            <span className="counter-value">{userSubmissionCount}</span>
          </div>
          <div className="counter-controls">
            <button onClick={handleCounterIncrement} className="counter-btn">
              Increment
            </button>
            <button onClick={handleCounterDecrement} className="counter-btn">
              Decrement
            </button>
            <button onClick={handleCounterReset} className="counter-btn reset">
              Reset
            </button>
            <button onClick={handleCounterIncrementByFive} className="counter-btn">
              +5
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Cie 