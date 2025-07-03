import React, { useState, useEffect } from 'react';

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedDate = currentTime.toLocaleDateString();
  const formattedTime = currentTime.toLocaleTimeString();

  return (
    <div className="flex items-center justify-center h-screen bg-white text-black">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to CHARUSAT!!!!</h1>
        <h2 className="text-2xl font-semibold mb-2">It is {formattedDate}</h2>
        <h2 className="text-2xl font-semibold">It is {formattedTime}</h2>
      </div>
    </div>
  );
};

export default App;
