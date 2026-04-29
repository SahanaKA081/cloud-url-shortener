@echo off
echo Starting Cloud-Based URL Shortener Services...

echo Starting ML Microservice (FastAPI)...
start cmd /k "cd ml_service && .\venv\Scripts\activate && uvicorn main:app --reload --port 8000"

echo Starting Backend (Node.js/Express)...
start cmd /k "cd backend && npm start"

echo Starting Frontend (React/Vite)...
start cmd /k "cd frontend && npm run dev"

echo All services are starting in separate windows!
echo Once the Vite server is ready, check the frontend window for the localhost URL (usually http://localhost:5173).
pause
