# Hugging Face Spaces requires port 7860
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install dependencies first (for Docker layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the ML service source code and model files
COPY main.py .
COPY url_model_advanced.pkl .

# Expose HF Spaces default port
EXPOSE 7860

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:7860/')"

# Run the FastAPI app on port 7860 (required by Hugging Face Spaces)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
