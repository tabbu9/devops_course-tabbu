const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

// Bearer auth middleware
function auth(req, res, next) {
  const token = (req.headers.authorization || '').split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// GET /api/user/profile -> { completions: [...] }
router.get('/profile', auth, async (req, res) => {
  try {
    const uid = req.user.sub || req.user.id;
    const [rows] = await db.query('SELECT topic FROM completions WHERE user_id = ?', [uid]);
    res.json({ completions: rows.map(r => r.topic) });
  } catch (err) {
    console.error('[profile] error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/user/complete { topic }
router.post('/complete', auth, async (req, res) => {
  try {
    const uid = req.user.sub || req.user.id;
    const topic = (req.body && req.body.topic || '').trim();
    if (!topic) return res.status(400).json({ error: 'topic is required' });

    await db.query(
      'INSERT IGNORE INTO completions (user_id, topic) VALUES (?, ?)',
      [uid, topic]
    );
    res.json({ message: 'Completion saved', topic });
  } catch (err) {
    console.error('[complete] error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/user/add-pdf { path, name }
router.post('/add-pdf', auth, async (req, res) => {
  try {
    const uid = req.user.sub || req.user.id;
    const { path, name } = req.body || {};
    if (!path || !name) return res.status(400).json({ error: 'path and name are required' });

    await db.query(
      'INSERT INTO user_pdfs (user_id, path, name) VALUES (?, ?, ?)',
      [uid, path, name]
    );
    res.json({ message: 'PDF added' });
  } catch (err) {
    console.error('[add-pdf] error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/user/pdfs
router.get('/pdfs', auth, async (req, res) => {
  try {
    const uid = req.user.sub || req.user.id;
    const [rows] = await db.query('SELECT id, path, name FROM user_pdfs WHERE user_id = ?', [uid]);
    res.json(rows);
  } catch (err) {
    console.error('[pdfs] error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
