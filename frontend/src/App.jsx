import { useState } from 'react'
import axios from 'axios'
import { Link2, ShieldAlert, CheckCircle, Copy, Loader2, Link as LinkIcon } from 'lucide-react'
import './index.css'

function App() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!url) return

    setIsLoading(true)
    setResult(null)
    setError(null)
    setCopied(false)

    try {
      // Send request to backend
      const response = await axios.post('/api/url/shorten', { originalUrl: url })
      setResult(response.data)
    } catch (err) {
      if (err.response && err.response.status === 403) {
        // Spam detected
        setError({
          type: 'spam',
          message: err.response.data.message || 'Spam Detected: This URL is flagged as unsafe.'
        })
      } else {
        // Other errors
        setError({
          type: 'error',
          message: 'Failed to shorten URL. Please try again later.'
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (result && result.shortUrl) {
      navigator.clipboard.writeText(result.shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">Secure URL Shortener</h1>
        <p className="subtitle">
          Shorten your links with built-in ML-powered spam detection.
          Protect your users from malicious destinations.
        </p>
      </header>

      <main className="main-card">
        <form onSubmit={handleSubmit} className="input-group">
          <div className="input-wrapper">
            <LinkIcon className="input-icon" size={20} />
            <input
              type="url"
              className="url-input"
              placeholder="Paste your long URL here (e.g. https://example.com/very/long/path)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={isLoading || !url}>
            {isLoading ? (
              <>
                <Loader2 className="spinner" size={20} />
                Analyzing & Shortening...
              </>
            ) : (
              <>
                <Link2 size={20} />
                Shorten URL
              </>
            )}
          </button>
        </form>

        {error && error.type === 'spam' && (
          <div className="result-card danger">
            <div className="result-header">
              <ShieldAlert size={24} />
              Spam Detected
            </div>
            <p style={{ color: 'var(--text-main)', lineHeight: '1.5' }}>
              {error.message} The system blocked the shortening process to protect users.
            </p>
          </div>
        )}

        {error && error.type === 'error' && (
          <div className="result-card danger" style={{ borderColor: '#ef4444' }}>
             <p style={{ color: '#ef4444' }}>{error.message}</p>
          </div>
        )}

        {result && !error && (
          <div className="result-card success">
            <div className="result-header">
              <CheckCircle size={24} />
              URL Successfully Shortened & Verified Safe
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', wordBreak: 'break-all' }}>
              Original: {result.originalUrl}
            </p>
            <div className="short-url-container">
              <a href={result.shortUrl} target="_blank" rel="noopener noreferrer" className="short-url">
                {result.shortUrl}
              </a>
              <button onClick={handleCopy} className="copy-btn" title="Copy to clipboard">
                {copied ? <CheckCircle size={20} color="var(--success)" /> : <Copy size={20} />}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
