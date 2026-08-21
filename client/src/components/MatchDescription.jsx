import React, { useState, useEffect } from 'react';

export default function MatchDescription({ matchData, onDescriptionChange }) {
  const [description, setDescription] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset state when matchData changes (new prediction)
  useEffect(() => {
    setDescription(null);
    setIsLoading(false);
    setError(null);
    if (onDescriptionChange) onDescriptionChange(null);
  }, [matchData]);

  // Client-side sarcastic fallback generator (100% uptime guaranteed)
  const generateClientFallback = (match) => {
    const { age, height, job, gender, personality, hobby, greenFlag } = match || {};
    const scenarios = [
      `Your future with this ${height} ${gender || 'partner'} (${age} y/o) who works as a ${job || 'freelancer'} revolves around their core obsession: "${personality || 'Fears Tupperware'}". Expect romantic date nights where they compel you into aggressive ${hobby || 'Sock Sorting'} while treating "${greenFlag || 'Claps On Landing'}" as their non-negotiable love language.`,
      `Imagine coming home to a ${age}-year-old ${job || 'Line Stander'} (${height}) whose entire vibe is "${personality || 'Rates Tap Water'}". They will drag you into emergency sessions of ${hobby || 'Cloud Rating'} and unironically consider "${greenFlag || 'Brings Spreadsheet'}" to be peak emotional intimacy.`,
      `Dating this ${height} ${job || 'Pet Psychic'} means accepting that "${personality || 'Refuses Tuesdays'}" isn't just a quirk—it's a lifestyle. Between random rounds of ${hobby || 'Baking Micro-Pies'}, they will look you in the eyes and declare "${greenFlag || 'Whispers Nice Paying'}" as their wedding vow.`
    ];
    return scenarios[Math.floor(Math.random() * scenarios.length)];
  };

  const handleGenerateDescription = async () => {
    if (!matchData) return;
    setIsLoading(true);
    setError(null);

    const targetBaseUrl = import.meta.env.VITE_API_URL || 'https://my-next-relationship.onrender.com';
    const primaryUrl = targetBaseUrl.replace(/\/$/, '') + '/api/describe';
    const secondaryUrl = 'https://my-next-relationship-api.onrender.com/api/describe';

    try {
      let response;
      try {
        response = await fetch(primaryUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ match: matchData }),
        });
      } catch (e) {
        response = await fetch(secondaryUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ match: matchData }),
        });
      }

      let desc = null;
      if (response && response.ok) {
        const data = await response.json();
        if (data.success && data.description) {
          desc = data.description;
        }
      }

      if (!desc) {
        desc = generateClientFallback(matchData);
      }

      setDescription(desc);
      if (onDescriptionChange) onDescriptionChange(desc);
    } catch (err) {
      console.warn('Network error fetching description. Using client fallback:', err);
      const fallbackDesc = generateClientFallback(matchData);
      setDescription(fallbackDesc);
      if (onDescriptionChange) onDescriptionChange(fallbackDesc);
    } finally {
      setIsLoading(false);
    }
  };

  if (!description && !isLoading) {
    return (
      <div className="match-description-trigger">
        <button
          className="stark-button secondary"
          onClick={handleGenerateDescription}
          style={{
            width: '100%',
            justifyContent: 'center',
            fontSize: '0.95rem',
            padding: '0.95rem 1.4rem',
            background: 'var(--pop-cyan)',
            color: '#000'
          }}
        >
          ✨ GENERATE SARCASTIC VIBE
        </button>
        <span className="token-saving-hint">
          ⚡ ON-DEMAND AI // SAVES TOKENS
        </span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="match-description-card loading">
        <div className="loading-spinner-inline"></div>
        <span className="mono-tag" style={{ color: '#000' }}>
          🔮 CRAFTING SARCASTIC IMAGINATION...
        </span>
      </div>
    );
  }

  return (
    <div className="match-description-card">
      <div className="card-header-bar">
        <span className="mono-tag-badge">
          🔮 SARCASTIC MATCH IMAGINATION
        </span>
        <button
          className="refresh-desc-btn"
          onClick={handleGenerateDescription}
          title="Re-generate description"
        >
          ↻ RE-GENERATE
        </button>
      </div>
      <p className="description-text">
        "{description}"
      </p>
    </div>
  );
}
