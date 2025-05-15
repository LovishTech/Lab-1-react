const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'forum_app',
  
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Example: Get all threads
app.get('/api/threads', (req, res) => {
  db.query('SELECT * FROM threads', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Example: Create a thread
app.post('/api/threads', (req, res) => {
  const { title, content } = req.body;
  db.query(
    'INSERT INTO threads (title, content) VALUES (?, ?)',
    [title, content],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, title, content });
    }
  );
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
