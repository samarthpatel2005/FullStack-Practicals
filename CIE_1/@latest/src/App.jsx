import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import Cie from './cie'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/cie" replace />} />
          <Route path="/cie" element={<Cie />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
