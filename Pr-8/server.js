const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const COUNTER_FILE = path.join(__dirname, 'counter.json');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Read counter from JSON
function readCounter() {
  if (!fs.existsSync(COUNTER_FILE)) {
    fs.writeFileSync(COUNTER_FILE, JSON.stringify({ counter: 0 }));
  }
  const data = fs.readFileSync(COUNTER_FILE, 'utf8');
  return JSON.parse(data).counter;
}

// Write counter to JSON
function writeCounter(value) {
  fs.writeFileSync(COUNTER_FILE, JSON.stringify({ counter: value }));
}

// API: Get current counter
app.get('/counter', (req, res) => {
  const count = readCounter();
  res.json({ counter: count });
});

// API: Update counter
app.post('/update', (req, res) => {
  const action = req.body.action;
  let count = readCounter();

  if (action === 'increment') count++;
  else if (action === 'decrement' && count > 0) count--;
  else if (action === 'reset') count = 0;

  writeCounter(count);
  res.json({ counter: count });
});

// Start server
app.listen(3000, () => {
  console.log('✅ Server running at http://localhost:3000');
});
