const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

const badRequest = (res, msg) => res.status(400).json({ error: msg });
const serverError = (res, err) => {
  console.error('[auth] error:', err);
  return res.status(500).json({ error: 'Internal server error' });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password || !name) return badRequest(res, 'name, email, and password are required');

    const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length) return res.status(409).json({ error: 'Email already exists' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hash, name]
    );

    const user = { id: result.insertId, email, name };
    const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.status(201).json({ user, token, message: 'Registered' });
  } catch (err) {
    return serverError(res, err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return badRequest(res, 'email and password are required');

    const [rows] = await db.query('SELECT id, email, name, password FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    return serverError(res, err);
  }
});

module.exports = router;
