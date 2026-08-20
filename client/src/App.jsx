import React, { useState } from 'react';
import UserInputForm from './components/UserInputForm.jsx';
import ZigZagDiagram from './components/ZigZagDiagram.jsx';

export default function App() {
  const [matchData, setMatchData] = useState(null);
  const [matchSource, setMatchSource] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUserInput, setLastUserInput] = useState(null);

  // Client-side fallback match generator (guarantees 100% uptime even if backend is 404 / sleeping / offline)
  const generateClientFallback = () => {
    const ages = ['12', '13', '14', '15', '16', '17', '18', '19', '45', '47', '51', '54', '58', '62', '65', '69', '72', '75', '78', '81', '84', '87', '89'];
    const heights = [`4'11" and ¾"`, `6'8"`, `5'2" (5'7" in boots)`, `6'1" (2mm exact)`, `7'0"`, `5'0" on tiptoes`, `6'5" and a half`, `4'10" exactly` ];
    const jobs = ['Golf Ball Diver', 'Water Slide Tester', 'Line Stander', 'Fortune Writer', 'Pet Psychic', 'Odor Judge', 'Paint Inspector', 'Lego Separator', 'Dice Tester'];
    const genders = ['Genderfluid', 'Agender', 'Non-binary', 'Cisgender Male', 'Transgender Woman', 'Two-Spirit', 'Demigirl', 'Pangender'];
    const personalities = ['Fears Tupperware', 'Ranks Soup Brands', 'Eats Yellow Food', 'Quotes Old Movies', 'Competes W/ Toddlers', 'Rates Eye Contact', 'Whispers To Plants'];
    const hobbies = ['Bird Watching', 'Collecting Lint', 'Baking Micro-Pies', 'Aggressive Origami', 'Cat Pitch Tuning', 'Synchronized Mowing', 'Sock Sorting', 'Cloud Rating'];
    const greenFlags = ['Claps On Landing', 'Wipes On Jeans', 'Brings Spreadsheet', 'Whispers "Nice" Paying', 'Listens 2.5x Speed', 'Asks "Who Am I?"', 'Reply-All On Emails', 'Ketchup On Tacos'];
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    return {
      age: getRandom(ages),
      height: getRandom(heights),
      job: getRandom(jobs),
      gender: getRandom(genders),
      personality: getRandom(personalities),
      hobby: getRandom(hobbies),
      greenFlag: getRandom(greenFlags)
    };
  };

  const fetchRelationshipMatch = async (userInput) => {
    setIsLoading(true);
    setError(null);
    setLastUserInput(userInput);

    const targetBaseUrl = import.meta.env.VITE_API_URL || 'https://my-next-relationship.onrender.com';
    const primaryUrl = targetBaseUrl.replace(/\/$/, '') + '/api/generate';
    const secondaryUrl = 'https://my-next-relationship-api.onrender.com/api/generate';

    try {
      let response;
      try {
        response = await fetch(primaryUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userInput),
        });
      } catch (e) {
        response = await fetch(secondaryUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userInput),
        });
      }

      if (response && response.ok) {
        const data = await response.json();
        if (data.success && data.match) {
          setMatchData(data.match);
          setMatchSource(data.source);
          return;
        }
      }

      // If backend returned 404 or error, use client-side fallback match generator
      console.warn('Backend returned status 404 or non-OK. Using client-side match fallback.');
      setMatchData(generateClientFallback());
      setMatchSource('client_fallback');
    } catch (err) {
      console.warn('Network error reaching Express backend. Using client-side match fallback:', err);
      setMatchData(generateClientFallback());
      setMatchSource('client_fallback');
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
      {/* Header with Clickable Logo */}
      <header className="app-header">
        <button className="logo-button" onClick={handleReset} title="Return to Home">
          <h1 className="app-title">MY NEXT RELATIONSHIP</h1>
          <div className="app-subtitle">DYNAMIC MATCHMAKING ENGINE</div>
        </button>
        <div className="mono-tag" style={{ border: '2px solid var(--border-color)', padding: '0.4rem 0.8rem', background: '#FFFFFF', boxShadow: '2px 2px 0px #000' }}>
          VER 1.0 // GEN-Z EDITION
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="main-content">
        {!matchData && !isLoading && (
          <UserInputForm onSubmit={fetchRelationshipMatch} isLoading={isLoading} />
        )}

        {isLoading && (
          <div className="loading-state">
            <div className="loading-text">FINDING YOUR MATCH...</div>
            <div className="loading-bar-container">
              <div className="loading-bar"></div>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--text-main)' }}>
              Querying Gemini API & Analyzing extreme parameters...
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
                onClick={() => fetchRelationshipMatch(lastUserInput || { age: 24, gender: 'Female' })}
              >
                TRY AGAIN ↺
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

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
              <button
                className="stark-button"
                style={{ width: '100%', maxWidth: '360px', justifyContent: 'center', fontSize: '1.05rem', padding: '1rem 2rem' }}
                onClick={() => fetchRelationshipMatch(lastUserInput)}
              >
                TRY AGAIN ↺
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
