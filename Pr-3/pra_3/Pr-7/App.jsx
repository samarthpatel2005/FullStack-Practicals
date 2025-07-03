import React, { useState } from "react";
import "./App.css";

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
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </div>

      <div className="content">
        <h1>Welcome to My Website</h1>
        <p>This is the main content of the webpage.</p>
      </div>
    </div>
  );
}

export default App;
