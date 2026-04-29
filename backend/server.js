const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Database connection
const DB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/url_shortener';
mongoose.connect(DB_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/url', require('./routes/urlRoutes'));

// Redirection Route
const Url = require('./models/Url');
app.get('/:shortId', async (req, res) => {
  try {
    const url = await Url.findOne({ shortId: req.params.shortId });
    if (url) {
      // Increment click count
      url.clicks++;
      await url.save();
      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json({ error: 'URL not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
