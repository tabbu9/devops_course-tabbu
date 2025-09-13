require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Routers
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use('/uploads', express.static(uploadDir));

// MOUNT ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/user', userRoutes);

// Upload PDFs
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });
app.post('/api/upload-pdf', upload.single('pdf'), (req, res) => {
  res.json({ filePath: `/uploads/${req.file.filename}` });
});

// Health + root
app.get('/health', (_, res) => res.json({ ok: true }));
app.get('/', (req, res) => {
  res.send(`<h2>DevOps Spaces API</h2><p>Port ${PORT}</p>`);
});

// DEBUG: list mounted routes quickly
app.get('/_debug/routes', (req, res) => {
  const list = [];
  app._router.stack.forEach((m) => {
    if (m.route && m.route.path) {
      const methods = Object.keys(m.route.methods).join(',').toUpperCase();
      list.push(`${methods} ${m.route.path}`);
    } else if (m.name === 'router' && m.handle.stack) {
      m.handle.stack.forEach((h) => {
        if (h.route && h.route.path) {
          const methods = Object.keys(h.route.methods).join(',').toUpperCase();
          // try to infer mount path prefix
          const prefix = m.regexp && m.regexp.source.includes('api\\/courses') ? '/api/courses' :
                         m.regexp && m.regexp.source.includes('api\\/auth') ? '/api/auth' :
                         m.regexp && m.regexp.source.includes('api\\/user') ? '/api/user' : '';
          list.push(`${methods} ${prefix}${h.route.path}`);
        }
      });
    }
  });
  res.json({ routes: list });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
