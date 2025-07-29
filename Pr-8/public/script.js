async function getCount() {
  const res = await fetch('/counter');
  const data = await res.json();
  document.getElementById('count').textContent = data.counter;
}

async function update(action) {
  const res = await fetch('/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action })
  });
  const data = await res.json();
  document.getElementById('count').textContent = data.counter;
}

getCount();
