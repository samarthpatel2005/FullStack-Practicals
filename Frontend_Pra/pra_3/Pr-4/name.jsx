import React, { useState } from 'react';

function Name() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  return (
    <div className="text-center">
      <h2 className="text-6xl font-bold mb-6">Welcome to CHARUSAT!!!</h2>

      <div className="space-y-2">
        <div>
          <label className="text-2xl mr-2">First Name:</label>
          <input
            type="text"
            className="border px-2 py-1 rounded"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label className="text-2xl mr-2">Last Name:</label>
          <input
            type="text"
            className="border px-2 py-1 rounded"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      <div className="text-2xl mt-6 space-y-1">
        <p>First Name: {firstName}</p>
        <p>Last Name: {lastName}</p>
      </div>
    </div>
  );
}

export default Name;
