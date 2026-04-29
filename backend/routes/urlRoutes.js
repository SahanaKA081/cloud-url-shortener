const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const Url = require('../models/Url');
const axios = require('axios');

// Python ML Service URL
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000/predict';

// @route   POST /api/url/shorten
// @desc    Create short URL
router.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

  if (!originalUrl) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // 1. Check with ML Service for spam detection
    let isSpam = false;
    try {
      const mlResponse = await axios.post(ML_SERVICE_URL, { url: originalUrl });
      if (mlResponse.data && mlResponse.data.is_spam) {
        isSpam = true;
      }
    } catch (mlError) {
      console.error('Error communicating with ML Service:', mlError.message);
      // Depending on requirements, we might allow it or block it if ML service is down. Let's allow but log error.
      // Or we can return an error: return res.status(500).json({ error: 'Failed to analyze URL safety.' });
    }

    if (isSpam) {
      return res.status(403).json({ error: 'Spam Detected', message: 'This URL has been classified as potentially malicious or spam.' });
    }

    // 2. Check if URL already exists
    let url = await Url.findOne({ originalUrl });
    if (url) {
      return res.json(url);
    }

    // 3. Create short URL
    const shortCode = shortid.generate();
    const shortUrl = `${baseUrl}/${shortCode}`;

    url = new Url({
      originalUrl,
      shortUrl,
      shortId: shortCode,
      date: new Date()
    });

    await url.save();
    res.json(url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
