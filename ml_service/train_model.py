import joblib
import pandas as pd
import numpy as np
import re
from sklearn.ensemble import RandomForestClassifier
from urllib.parse import urlparse
import os

# --- 1. Feature Extraction Engine ---
def extract_features(url: str):
    """Extracts numerical features from a given URL to make the ML model smarter and generalize to ANY URL."""
    features = {}
    url_lower = url.lower()
    
    # Feature 1: Length of URL
    features['url_length'] = len(url)
    
    # Feature 2: Number of dots
    features['num_dots'] = url.count('.')
    
    # Feature 3: Number of hyphens
    features['num_hyphens'] = url.count('-')
    
    # Feature 4: Number of digits
    features['num_digits'] = sum(c.isdigit() for c in url)
    
    # Feature 5: Contains IP address
    ip_pattern = re.compile(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}')
    features['has_ip'] = 1 if ip_pattern.search(url) else 0
    
    # Feature 6: Suspicious keywords
    spam_keywords = ['free', 'win', 'prize', 'cheap', 'bonus', 'login', 'secure', 'update', 'verify', 'account', 'bank', 'paypal', 'xxx', 'dating', 'viagra']
    features['spam_keywords'] = sum(1 for word in spam_keywords if word in url_lower)
    
    # Feature 7: Suspicious TLDs
    suspicious_tlds = ['.zip', '.mov', '.ru', '.cn', '.tk', '.ml', '.ga', '.cf', '.gq', '.cc']
    features['suspicious_tld'] = 1 if any(tld in url_lower for tld in suspicious_tlds) else 0
    
    # Feature 8: Path length
    try:
        parsed = urlparse(url)
        features['path_length'] = len(parsed.path)
    except:
        features['path_length'] = 0
        
    return features

# --- 2. Training Data ---
urls = [
    # SAFE URLs
    "https://www.google.com", "https://github.com/user/repo", "https://www.youtube.com/watch?v=123",
    "https://reactjs.org/docs", "https://amazon.com/products/123", "https://netflix.com/browse",
    "https://stackoverflow.com/questions", "https://en.wikipedia.org/wiki/Machine_learning",
    "https://www.apple.com/iphone/", "https://medium.com/@user/article",
    # SPAM/MALICIOUS URLs
    "http://192.168.1.1/free-prize.zip", "http://buy-cheap-viagra.cn/bonus", "http://win-iphone-now.tk/clickhere",
    "http://paypal-update-security.ml/login", "https://secure-bank-login.ga/auth", "http://hack-malware.com/download",
    "http://free-movies-online.cc", "http://xxx-adult-dating.gq/join", "http://crypto-giveaway.tk/claim",
    "http://your-account-blocked.cf/verify", "http://10.0.0.5/malware.exe", "http://172.16.0.4/secure-update",
    "http://verify-your-bank-account-now.com/login"
]

labels = [0]*10 + [1]*13  # 0 for Safe, 1 for Spam

# --- 3. Extract Features for Dataset ---
print("Extracting features from URLs...")
features_list = [extract_features(url) for url in urls]
X = pd.DataFrame(features_list)
y = np.array(labels)

# --- 4. Train RandomForest Model ---
print("Training RandomForest ML Model...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# --- 5. Save the model ---
base_dir = os.path.dirname(os.path.abspath(__file__))
joblib.dump(model, os.path.join(base_dir, 'url_model_advanced.pkl'))

print("Advanced ML Model trained and saved successfully!")
