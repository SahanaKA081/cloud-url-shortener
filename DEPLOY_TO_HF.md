# 🚀 Deploy to Hugging Face Spaces — Step-by-Step Guide

This guide walks you through deploying the **Cloud URL Shortener** to two free Hugging Face Spaces.

---

## Prerequisites

- [ ] A free account at https://huggingface.co (sign up if needed)
- [ ] Git installed on your machine
- [ ] Your **MongoDB Atlas** connection string (with real password)
- [ ] `git-lfs` installed (for large model files): https://git-lfs.github.com/

---

## Architecture Overview

```
User Browser
    │
    ▼
[ Space 2: url-shortener-app ]  ← React UI + Node.js API
    │  (calls /predict)
    ▼
[ Space 1: url-shortener-ml ]   ← Python FastAPI (spam detection)
    │
    ▼
[ MongoDB Atlas ]               ← Cloud database
```

---

## STEP 1 — Deploy the ML Service (Space 1)

### 1.1 Create the Space on Hugging Face

1. Go to https://huggingface.co/new-space
2. Fill in:
   - **Space name**: `url-shortener-ml`
   - **License**: MIT
   - **SDK**: **Docker**
   - **Visibility**: Public
3. Click **Create Space**

### 1.2 Push the ML Service code

Open **PowerShell** in your project folder and run:

```powershell
# Navigate to the ml_service folder
cd "C:\Users\Os Tech Hub\Desktop\cc project\ml_service"

# Clone the empty HF Space (replace YOUR_USERNAME)
git clone https://huggingface.co/spaces/YOUR_USERNAME/url-shortener-ml hf_ml_space

# Copy all ml_service files into the cloned folder
Copy-Item main.py, requirements.txt, Dockerfile, README.md, url_model_advanced.pkl -Destination hf_ml_space\

# Enter the folder and push
cd hf_ml_space
git add .
git commit -m "Initial ML service deployment"
git push
```

> ⏱️ The Space will take **2-5 minutes** to build the Docker image.

### 1.3 Get the ML Space URL

Once it's running (green "Running" badge), your ML service URL will be:
```
https://YOUR_USERNAME-url-shortener-ml.hf.space
```
**Copy this URL** — you'll need it for Step 2.

---

## STEP 2 — Deploy the Full App (Space 2)

### 2.1 Create the Space on Hugging Face

1. Go to https://huggingface.co/new-space
2. Fill in:
   - **Space name**: `url-shortener-app`
   - **License**: MIT
   - **SDK**: **Docker**
   - **Visibility**: Public
3. Click **Create Space**

### 2.2 Set Environment Variables (Secrets)

In your Space → **Settings** → **Variables and secrets**:

| Secret Name | Value |
|---|---|
| `MONGO_URI` | `mongodb+srv://sahanaka2005_db_user:YOUR_PASSWORD@cluster0.wvma27d.mongodb.net/?appName=Cluster0` |
| `BASE_URL` | `https://YOUR_USERNAME-url-shortener-app.hf.space` |
| `ML_SERVICE_URL` | `https://YOUR_USERNAME-url-shortener-ml.hf.space/predict` |
| `PORT` | `7860` |

> ⚠️ Replace `YOUR_PASSWORD` with your actual MongoDB Atlas password.

### 2.3 Push the App code

Open **PowerShell** in your project root folder:

```powershell
# Go to your project root
cd "C:\Users\Os Tech Hub\Desktop\cc project"

# Clone the empty HF Space (replace YOUR_USERNAME)
git clone https://huggingface.co/spaces/YOUR_USERNAME/url-shortener-app hf_app_space

# Copy required files (excluding ml_service, node_modules, venv)
$dest = "hf_app_space"
Copy-Item Dockerfile, README.md, .dockerignore -Destination $dest\
Copy-Item -Recurse backend -Destination $dest\ -Exclude node_modules
Copy-Item -Recurse frontend -Destination $dest\ -Exclude node_modules,dist

# Enter and push
cd hf_app_space
git add .
git commit -m "Initial app deployment"
git push
```

> ⏱️ The Space will take **3-7 minutes** to build (it compiles React + installs Node deps).

---

## STEP 3 — Verify Everything Works

1. **Visit your app Space**: `https://YOUR_USERNAME-url-shortener-app.hf.space`
2. **Test a safe URL**: Paste `https://github.com` → should shorten successfully ✅
3. **Test a spam URL**: Paste `http://buy-cheap-viagra.cn/bonus` → should show "Spam Detected" 🛡️
4. **Test redirection**: Click the generated short link → should redirect to the original URL ↗️

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Space shows "Error" | Click **Logs** tab to see Docker build/runtime errors |
| "MongoDB connection error" | Check `MONGO_URI` secret — make sure password has no `<>` placeholder |
| ML spam detection not working | Check `ML_SERVICE_URL` secret — verify Space 1 is "Running" |
| Short link goes to 404 | The `BASE_URL` secret must match your Space 2 URL exactly |

---

## Your Final URLs

| Resource | URL |
|---|---|
| 🤖 ML Service API | `https://YOUR_USERNAME-url-shortener-ml.hf.space` |
| 🔗 URL Shortener App | `https://YOUR_USERNAME-url-shortener-app.hf.space` |
| 📊 ML API Docs | `https://YOUR_USERNAME-url-shortener-ml.hf.space/docs` |
