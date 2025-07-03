import React from 'react';
import Counter from './counter';
import Name from './name';

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-8">
      <Counter />
      <Name />
    </div>
  );
}

export default App;
