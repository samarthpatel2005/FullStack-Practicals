import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import About from "./src/pages/About.jsx";
import Contact from "./src/pages/Contact.jsx";
import Home from "./src/pages/Home.jsx";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="app">
      <button className="toggle-button" onClick={toggleSidebar}>
        &#9776;
      </button>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <Link to="/" onClick={toggleSidebar}>Home</Link>
        <Link to="/about" onClick={toggleSidebar}>About</Link>
        <Link to="/contact" onClick={toggleSidebar}>Contact</Link>
      </div>

      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
