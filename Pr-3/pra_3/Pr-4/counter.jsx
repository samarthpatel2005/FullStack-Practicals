import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="text-center">
      <h1 className="text-6xl font-bold mb-4">Count: {count}</h1>
      <div className="space-x-2">
        <button onClick={() => setCount(0)} className="border px-3 py-1 rounded">
          Reset
        </button>
        <button onClick={() => setCount(count + 1)} className="border px-3 py-1 rounded">
          Increment
        </button>
        <button onClick={() => setCount(count - 1)} className="border px-3 py-1 rounded">
          Decrement
        </button>
        <button onClick={() => setCount(count + 5)} className="border px-3 py-1 rounded">
          Increment 5
        </button>
      </div>
    </div>
  );
}

export default Counter;
