---
title: URL Shortener App
emoji: 🔗
colorFrom: indigo
colorTo: blue
sdk: docker
pinned: false
license: mit
---

# 🔗 Cloud URL Shortener with ML Spam Detection

A full-stack URL shortener powered by **Machine Learning** to detect and block malicious/spam URLs before they are shortened.

## Features
- ✅ Shorten any safe URL instantly
- 🛡️ ML-powered spam detection (Random Forest classifier)
- 📊 Click tracking for each short link
- 🔄 Automatic redirection from short links

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| ML Service | Python FastAPI (separate HF Space) |

## Environment Variables (set as HF Secrets)

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `BASE_URL` | This Space's public URL (e.g. `https://SahanaKA081-url-shortener-app.hf.space`) |
| `ML_SERVICE_URL` | ML Space URL + `/predict` endpoint |
| `PORT` | `7860` (Hugging Face default) |
