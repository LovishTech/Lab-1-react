const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = 'your_jwt_secret';

// --- MySQL Connection ---
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', // Change as needed
  database: 'forum_app',
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// --- SIGN UP ---
app.post(
  '/api/auth/signup',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('fullName').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    const { fullName, email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, users) => {
      if (err) return res.status(500).json({ error: err });
      if (users.length > 0) return res.status(400).json({ error: 'Email already exists' });
      const hashedPassword = await bcrypt.hash(password, 10);
      db.query(
        'INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)',
        [fullName, email, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json({ error: err });
          const token = jwt.sign({ email, fullName }, JWT_SECRET, { expiresIn: '1d' });
          res.json({ token, email, fullName });
        }
      );
    });
  }
);

// --- SIGN IN ---
app.post(
  '/api/auth/signin',
  [
    body('email').isEmail(),
    body('password').notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, users) => {
      if (err) return res.status(500).json({ error: err });
      if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
      const user = users[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ email: user.email, fullName: user.fullName }, JWT_SECRET, { expiresIn: '1d' });
      res.json({ token, email: user.email, fullName: user.fullName });
    });
  }
);

// --- THREADS: GET ALL ---
app.get('/api/threads', (req, res) => {
  db.query('SELECT * FROM threads ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// --- THREADS: GET ONE BY ID ---
app.get('/api/threads/:threadId', (req, res) => {
  const { threadId } = req.params;
  db.query('SELECT * FROM threads WHERE id = ?', [threadId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ error: 'Thread not found' });
    res.json(results[0]);
  });
});

// --- THREADS: CREATE NEW ---
app.post('/api/threads', (req, res) => {
  const { title, content, author } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  db.query(
    'INSERT INTO threads (title, content, author) VALUES (?, ?, ?)',
    [title, content, author || "Anonymous"],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, title, content, author: author || "Anonymous" });
    }
  );
});

// --- Middleware to check if thread exists ---
const threadExists = (req, res, next) => {
  const threadId = req.params.threadId;
  db.query('SELECT * FROM threads WHERE id = ?', [threadId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ error: 'Thread not found' });
    req.thread = results[0];
    next();
  });
};

// --- THREADS: UPDATE (EDIT) ---
app.put('/api/threads/:threadId', threadExists, (req, res) => {
  const { threadId } = req.params;
  const { title, content } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  
  db.query(
    'UPDATE threads SET title = ?, content = ? WHERE id = ?',
    [title, content, threadId],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      
      // Return the updated thread
      db.query('SELECT * FROM threads WHERE id = ?', [threadId], (err, threads) => {
        if (err) return res.status(500).json({ error: 'Failed to retrieve updated thread' });
        res.json(threads[0]);
      });
    }
  );
});

// --- THREADS: DELETE (Safe for Foreign Key Constraint) ---
app.delete('/api/threads/:threadId', threadExists, (req, res) => {
  const { threadId } = req.params;
  
  // Begin a transaction to ensure both operations succeed or fail together
  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: 'Transaction error' });
    
    // First, delete all replies for this thread
    db.query('DELETE FROM replies WHERE thread_id = ?', [threadId], (err) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: 'Failed to delete replies' });
        });
      }
      
      // Then, delete the thread itself
      db.query('DELETE FROM threads WHERE id = ?', [threadId], (err, result) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: 'Failed to delete thread' });
          });
        }
        
        // Commit the transaction
        db.commit(err => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: 'Failed to commit transaction' });
            });
          }
          res.json({ message: 'Thread and its replies deleted successfully' });
        });
      });
    });
  });
});

// --- THREADS: VOTE (LIKE/DISLIKE) ---
app.post('/api/threads/:threadId/vote', threadExists, (req, res) => {
  const { threadId } = req.params;
  const { isLike } = req.body;
  const voteValue = isLike ? 1 : -1;
  
  db.query(
    'UPDATE threads SET likeCount = IFNULL(likeCount,0) + ? WHERE id = ?',
    [voteValue, threadId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      
      db.query('SELECT * FROM threads WHERE id = ?', [threadId], (err, threads) => {
        if (err) return res.status(500).json({ error: err });
        if (threads.length === 0) return res.status(404).json({ error: 'Thread not found' });
        res.json(threads[0]);
      });
    }
  );
});

// --- REPLIES: GET ALL FOR A THREAD ---
app.get('/api/threads/:threadId/replies', threadExists, (req, res) => {
  const { threadId } = req.params;
  
  db.query(
    'SELECT * FROM replies WHERE thread_id = ? ORDER BY created_at ASC', 
    [threadId], 
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

// --- REPLIES: CREATE NEW ---
app.post('/api/threads/:threadId/replies', threadExists, (req, res) => {
  const { threadId } = req.params;
  const { content, author } = req.body;
  
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }
  
  db.query(
    'INSERT INTO replies (thread_id, content, author) VALUES (?, ?, ?)',
    [threadId, content, author || 'Anonymous'],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      
      // Get the newly created reply
      db.query('SELECT * FROM replies WHERE id = ?', [result.insertId], (err, replies) => {
        if (err) return res.status(500).json({ error: err });
        res.json(replies[0]);
      });
    }
  );
});

// --- REPLIES: DELETE ---
app.delete('/api/replies/:replyId', (req, res) => {
  const { replyId } = req.params;
  
  db.query('DELETE FROM replies WHERE id = ?', [replyId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Reply not found' });
    res.json({ message: 'Reply deleted successfully' });
  });
});

// --- HEALTH CHECK ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));