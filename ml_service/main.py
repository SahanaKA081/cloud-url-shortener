from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import re

app = FastAPI()

class URLRequest(BaseModel):
    url: str

class URLResponse(BaseModel):
    url: str
    is_spam: bool
    confidence: float

import joblib
import os

import joblib
import pandas as pd
import re
from urllib.parse import urlparse
import os

# Load the trained advanced ML model
base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, 'url_model_advanced.pkl')

try:
    model = joblib.load(model_path)
    print("Advanced Machine Learning Model loaded successfully!")
except Exception as e:
    print(f"Warning: Could not load ML model. Did you run train_model.py? Error: {e}")
    model = None

def extract_features(url: str):
    """Extracts numerical features from a given URL to make the ML model smarter and generalize to ANY URL."""
    features = {}
    url_lower = url.lower()
    
    features['url_length'] = len(url)
    features['num_dots'] = url.count('.')
    features['num_hyphens'] = url.count('-')
    features['num_digits'] = sum(c.isdigit() for c in url)
    
    ip_pattern = re.compile(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}')
    features['has_ip'] = 1 if ip_pattern.search(url) else 0
    
    spam_keywords = ['free', 'win', 'prize', 'cheap', 'bonus', 'login', 'secure', 'update', 'verify', 'account', 'bank', 'paypal', 'xxx', 'dating', 'viagra']
    features['spam_keywords'] = sum(1 for word in spam_keywords if word in url_lower)
    
    suspicious_tlds = ['.zip', '.mov', '.ru', '.cn', '.tk', '.ml', '.ga', '.cf', '.gq', '.cc']
    features['suspicious_tld'] = 1 if any(tld in url_lower for tld in suspicious_tlds) else 0
    
    try:
        parsed = urlparse(url)
        features['path_length'] = len(parsed.path)
    except:
        features['path_length'] = 0
        
    return features

def check_spam_ml(url: str) -> dict:
    if model is None:
        return {"is_spam": False, "confidence": 1.0}
        
    # Extract Features into a DataFrame (since the model was trained on a DataFrame)
    features_dict = extract_features(url)
    url_features = pd.DataFrame([features_dict])
    
    # Predict (0 = Safe, 1 = Spam)
    prediction = model.predict(url_features)[0]
    
    # Get probability
    probabilities = model.predict_proba(url_features)[0]
    spam_prob = probabilities[1]
    
    # If the probability of being spam is > 50%
    is_spam = prediction == 1
    
    return {
        "is_spam": bool(is_spam),
        "confidence": float(spam_prob if is_spam else probabilities[0])
    }

@app.post("/predict", response_model=URLResponse)
def predict_spam(request: URLRequest):
    try:
        result = check_spam_ml(request.url)
        return URLResponse(
            url=request.url,
            is_spam=result["is_spam"],
            confidence=result["confidence"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "ML Spam Detection API is running. Send POST requests to /predict"}
