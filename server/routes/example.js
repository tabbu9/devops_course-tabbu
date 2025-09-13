const express = require('express');
const router = express.Router();
const db = require('../db/mysql');

router.get('/test-mysql', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT NOW() AS now');
    res.json({ now: rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;