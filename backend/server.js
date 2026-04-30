const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Database connection (5s timeout so the server fails fast if DB is unreachable)
const DB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/url_shortener';
mongoose.connect(DB_URI, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err.message));

// Health check (used by Docker HEALTHCHECK)
app.get('/api/url/health', (req, res) => res.json({ status: 'ok' }));

// API Routes
app.use('/api/url', require('./routes/urlRoutes'));

// Redirection Route (must come before static serving catch-all)
const Url = require('./models/Url');
app.get('/:shortId', async (req, res, next) => {
  // Skip if it looks like a static asset or API path
  const { shortId } = req.params;
  if (shortId === 'index.html' || shortId.includes('.')) {
    return next();
  }
  try {
    const url = await Url.findOne({ shortId });
    if (url) {
      url.clicks++;
      await url.save();
      return res.redirect(url.originalUrl);
    } else {
      return next(); // Let React handle 404
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve React Frontend static build (production)
const frontendBuildPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendBuildPath));

// Catch-all: send React app for any unmatched routes (Express 5 compatible)
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

const PORT = process.env.PORT || 7860;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

