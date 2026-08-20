import React, { useState } from 'react';
import UserInputForm from './components/UserInputForm.jsx';
import ZigZagDiagram from './components/ZigZagDiagram.jsx';

export default function App() {
  const [matchData, setMatchData] = useState(null);
  const [matchSource, setMatchSource] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUserInput, setLastUserInput] = useState(null);

  const fetchRelationshipMatch = async (userInput) => {
    setIsLoading(true);
    setError(null);
    setLastUserInput(userInput);

    try {
      // In production/GitHub Pages, API endpoint can be overridden via VITE_API_URL or defaults to relative /api/generate
      const apiUrl = import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/api/generate`
        : '/api/generate';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInput),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.match) {
        setMatchData(data.match);
        setMatchSource(data.source);
      } else {
        throw new Error(data.message || 'Failed to generate match data.');
      }
    } catch (err) {
      console.error('Error calculating relationship:', err);
      setError(err.message || 'Network error communicating with Express backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMatchData(null);
    setError(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Stark Minimalist Header */}
      <header className="app-header">
        <div>
          <h1 className="app-title">MY NEXT RELATIONSHIP</h1>
          <div className="app-subtitle">DYNAMIC SARCASTIC MATCHMAKING ENGINE</div>
        </div>
        <div className="mono-tag" style={{ border: '1px solid var(--border-color)', padding: '0.4rem 0.8rem', background: '#FFFFFF' }}>
          VER 1.0 // STARK EDITION
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="main-content">
        {!matchData && !isLoading && (
          <UserInputForm onSubmit={fetchRelationshipMatch} isLoading={isLoading} />
        )}

        {isLoading && (
          <div className="loading-state">
            <div className="loading-text">CALCULATING RED FLAGS...</div>
            <div className="loading-bar-container">
              <div className="loading-bar"></div>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              Querying Gemini API & Analyzing extreme age parameters...
            </p>
          </div>
        )}

        {error && (
          <div className="stark-card" style={{ borderColor: 'var(--accent-red-flag)' }}>
            <h3 style={{ color: 'var(--accent-red-flag)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              SYSTEM ERROR // FETCH FAILED
            </h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>{error}</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                className="stark-button"
                onClick={() => fetchRelationshipMatch(lastUserInput || { age: 24, gender: 'Non-binary' })}
              >
                RETRY CALCULATION
              </button>
              <button
                className="stark-button secondary"
                onClick={handleReset}
              >
                BACK TO FORM
              </button>
            </div>
          </div>
        )}

        {matchData && !isLoading && (
          <div>
            <ZigZagDiagram matchData={matchData} matchSource={matchSource} />

            <div className="actions-row">
              <button
                className="stark-button secondary"
                onClick={handleReset}
              >
                ← CHANGE INPUTS
              </button>
              <button
                className="stark-button"
                onClick={() => fetchRelationshipMatch(lastUserInput)}
              >
                RE-CALCULATE MATCH ↻
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Stark Minimalist Footer */}
      <footer className="footer">
        <div>MY NEXT RELATIONSHIP // EXPRESS & GEMINI API POWERED // NO EMOJIS // STARK MINIMALISM</div>
      </footer>
    </div>
  );
}
