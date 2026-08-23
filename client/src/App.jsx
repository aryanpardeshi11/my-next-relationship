import React, { useState } from 'react';
import UserInputForm from './components/UserInputForm.jsx';
import ZigZagDiagram from './components/ZigZagDiagram.jsx';
import MatchDescription from './components/MatchDescription.jsx';
import SocialShareModal from './components/SocialShareModal.jsx';

export default function App() {
  const [matchData, setMatchData] = useState(null);
  const [matchSource, setMatchSource] = useState(null);
  const [matchDescription, setMatchDescription] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPredictionComplete, setIsPredictionComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUserInput, setLastUserInput] = useState(null);

  const descTriggerRef = React.useRef(null);

  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const loadingPhrases = [
    'Connecting to matchmaking engine...',
    'Consulting cosmic matchmaking algorithms...',
    'Filtering out people who put milk before cereal...',
    'Calculating extreme height and personality quirks...',
    'Analyzing neural compatibility parameters...',
    'Asking pet psychics for emergency validation...',
    'Almost ready! Preparing statistically improbable match...'
  ];

  // Cold start timer and phrase cycling
  React.useEffect(() => {
    if (!isLoading) {
      setElapsedSeconds(0);
      setLoadingPhraseIndex(0);
      return;
    }

    const timerInterval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    const phraseInterval = setInterval(() => {
      setLoadingPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
    }, 2800);

    return () => {
      clearInterval(timerInterval);
      clearInterval(phraseInterval);
    };
  }, [isLoading]);

  // Client-side fallback match generator (guarantees 100% uptime even if backend is 404 / sleeping / offline)
  const generateClientFallback = (userInput) => {
    const ages = ['12', '13', '14', '15', '16', '17', '18', '19', '45', '47', '51', '54', '58', '62', '65', '69', '72', '75', '78', '81', '84', '87', '89'];
    const heights = [`4'11" and ¾"`, `6'8"`, `5'2" (5'7" in boots)`, `6'1" (2mm exact)`, `7'0"`, `5'0" on tiptoes`, `6'5" and a half`, `4'10" exactly` ];
    const jobs = ['Golf Ball Diver', 'Water Slide Tester', 'Line Stander', 'Fortune Writer', 'Pet Psychic', 'Odor Judge', 'Paint Inspector', 'Lego Separator', 'Dice Tester'];
    let genders = ['Male', 'Female', 'Transgender Woman', 'Transgender Man', 'Non-binary', 'Agender'];
    const userGender = userInput?.gender;
    if (userGender === 'Male') {
      genders = genders.filter(g => g !== 'Female');
    } else if (userGender === 'Female') {
      genders = genders.filter(g => g !== 'Male');
    }
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
    setIsPredictionComplete(false);
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
      setMatchData(generateClientFallback(userInput));
      setMatchSource('client_fallback');
    } catch (err) {
      console.warn('Network error reaching Express backend. Using client-side match fallback:', err);
      setMatchData(generateClientFallback(userInput));
      setMatchSource('client_fallback');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMatchData(null);
    setError(null);
    setIsPredictionComplete(false);
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

            <div
              style={{
                marginTop: '1.2rem',
                padding: '0.8rem 1.2rem',
                background: 'var(--pop-yellow)',
                border: '2.5px solid #000',
                boxShadow: '4px 4px 0px #000',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
                maxWidth: '480px'
              }}
            >
              <p
                style={{
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '800',
                  color: '#000',
                  margin: 0,
                  textAlign: 'center'
                }}
              >
                ⚡ {loadingPhrases[loadingPhraseIndex]}
              </p>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '900',
                  color: '#555',
                  background: '#FFF',
                  padding: '0.2rem 0.6rem',
                  border: '1.5px solid #000',
                  boxShadow: '2px 2px 0px #000'
                }}
              >
                ELAPSED TIME: {elapsedSeconds < 10 ? `0${elapsedSeconds}` : elapsedSeconds}s
              </span>
            </div>
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
                I DESERVE BETTER ↺
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
          <div className="match-result-workspace">
            <ZigZagDiagram
              matchData={matchData}
              matchSource={matchSource}
              onPredictionComplete={setIsPredictionComplete}
            />

            {/* Reveal Sarcastic Description & Side-by-Side Action Buttons ONLY after Node 7 finishes predicting */}
            {isPredictionComplete && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <MatchDescription
                  matchData={matchData}
                  userInput={lastUserInput}
                  onDescriptionChange={setMatchDescription}
                  triggerRef={descTriggerRef}
                />

                <div className="action-buttons-layout">
                  <div className="buttons-row-side-by-side">
                    <button
                      className="stark-button"
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        fontSize: '0.95rem',
                        padding: '0.9rem 1.2rem',
                        background: 'var(--pop-pink)',
                        color: '#FFFFFF'
                      }}
                      onClick={() => fetchRelationshipMatch(lastUserInput)}
                    >
                      I DESERVE BETTER ↺
                    </button>
                    <button
                      className="stark-button"
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        fontSize: '0.95rem',
                        padding: '0.9rem 1.2rem',
                        background: '#FFFC00',
                        color: '#000000',
                        border: '2.5px solid #000'
                      }}
                      onClick={() => setIsShareModalOpen(true)}
                    >
                      👻 SHARE MATCH SNAP
                    </button>
                  </div>
                </div>

                <div className="perfect-match-banner">
                  IT'S A PERFECT MATCH 😉
                </div>
              </div>
            )}

            {isShareModalOpen && (
              <SocialShareModal
                matchData={matchData}
                userInput={lastUserInput}
                matchDescription={matchDescription}
                onClose={() => setIsShareModalOpen(false)}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
