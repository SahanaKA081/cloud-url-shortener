---
title: URL Shortener ML Service
emoji: 🛡️
colorFrom: purple
colorTo: blue
sdk: docker
pinned: false
license: mit
---

# URL Spam Detection ML Service

A FastAPI-based Machine Learning service that classifies URLs as **safe** or **spam/malicious** using a Random Forest classifier.

## API Endpoints

### `POST /predict`
Classifies a URL as spam or safe.

**Request Body:**
```json
{ "url": "https://example.com" }
```

**Response:**
```json
{
  "url": "https://example.com",
  "is_spam": false,
  "confidence": 0.97
}
```

### `GET /`
Health check — returns a status message.

## Features Used for Classification
- URL length
- Number of dots, hyphens, digits
- Presence of IP address pattern
- Suspicious keywords (free, win, prize, bank, etc.)
- Suspicious TLDs (.zip, .tk, .ru, .cn, etc.)
- Path length
