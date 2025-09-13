const fs = require('fs');
const path = require('path');
const express = require('express');

const router = express.Router();
const DATA_DIR = path.join(__dirname, '../courses-data');

/**
 * GET /api/courses/topics
 * Returns: ["aws","docker","kubernetes", ...]
 * (Plain array so the frontend can do topics.map(...) directly.)
 */
router.get('/topics', (_req, res) => {
  try {
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    const topics = files.map(f => path.basename(f, '.json'));
    return res.json(topics);
  } catch (err) {
    console.error('[courses] topics error:', err);
    return res.status(500).json({ error: 'Failed to read topics' });
  }
});

/**
 * GET /api/courses/subtopics/:topicKey
 * Returns the JSON of /server/courses-data/<topicKey>.json
 */
router.get('/subtopics/:topicKey', (req, res) => {
  const { topicKey } = req.params;
  try {
    const dataPath = path.join(DATA_DIR, `${topicKey}.json`);
    if (!fs.existsSync(dataPath)) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const content = fs.readFileSync(dataPath, 'utf-8');
    return res.json(JSON.parse(content));
  } catch (err) {
    console.error('[courses] subtopics error:', err);
    return res.status(500).json({ error: 'Failed to read course data' });
  }
});

module.exports = router;
