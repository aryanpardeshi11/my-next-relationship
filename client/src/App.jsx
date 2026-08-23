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
  const [attemptCount, setAttemptCount] = useState(() => {
    return parseInt(localStorage.getItem('matchAttemptCount') || '0', 10);
  });
  const [isSharedView, setIsSharedView] = useState(false);
  // 4 Emotional & Sarcastic Reaction Options
  const REACTION_OPTIONS = [
    { id: 'approve', text: '😭 I ACCEPT MY FATE', bg: '#FF52A2', color: '#FFF' },
    { id: 'helpless', text: '🆘 SOMEONE SAVE ME', bg: '#FFFC00', color: '#000' },
    { id: 'speechless', text: '🤐 I\'M SPEECHLESS', bg: '#00E5FF', color: '#000' },
    { id: 'redflag', text: '💀 RED FLAG MAGNET', bg: '#A060FF', color: '#FFF' }
  ];

  const [userReaction, setUserReaction] = useState(null);

  const descTriggerRef = React.useRef(null);

  // Helper functions for short clean URL sharing
  const createShortMatchCode = (match) => {
    if (!match) return '';
    const arr = [
      match.age || '',
      match.height || '',
      match.job || '',
      match.gender || '',
      match.personality || match.trait || '',
      match.hobby || '',
      match.greenFlag || match.redFlag || ''
    ];
    try {
      return btoa(encodeURIComponent(JSON.stringify(arr)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    } catch (e) {
      return '';
    }
  };

  const parseShortMatchCode = (str) => {
    if (!str) return null;
    try {
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) base64 += '=';
      const decoded = JSON.parse(decodeURIComponent(atob(base64)));
      if (Array.isArray(decoded) && decoded.length >= 7) {
        return {
          age: decoded[0],
          height: decoded[1],
          job: decoded[2],
          gender: decoded[3],
          personality: decoded[4],
          hobby: decoded[5],
          greenFlag: decoded[6]
        };
      }
      if (typeof decoded === 'object' && decoded.age) return decoded;
    } catch (e) {
      try {
        const decodedRaw = JSON.parse(atob(str));
        if (typeof decodedRaw === 'object' && decodedRaw.age) return decodedRaw;
      } catch (err) {}
    }
    return null;
  };

  // Check for shared match in URL search params on mount
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const encodedMatch = params.get('m') || params.get('match');
      if (encodedMatch) {
        const parsed = parseShortMatchCode(encodedMatch);
        if (parsed && parsed.age && parsed.gender) {
          setMatchData(parsed);
          setMatchSource('shared_deep_link');
          setIsPredictionComplete(true);
          setIsSharedView(true);
        }
      }
    } catch (e) {
      console.warn('Failed to parse shared match parameter from URL:', e);
    }
  }, []);

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

  // Client-side fallback match generator (50+ items per pool, desperation tiering, & Pity System)
  const generateClientFallback = (userInput, currentCount) => {
    // Pity System: After every 3 chaotic attempts, the 4th attempt yields a genuine realistic match!
    if (currentCount && currentCount % 4 === 0) {
      return {
        age: '26',
        height: `5'10"`,
        job: 'Architect',
        gender: userInput?.gender === 'Male' ? 'Female' : 'Male',
        personality: 'Makes Great Coffee',
        hobby: 'Golden Hour Photography',
        greenFlag: 'Remembers Your Birthday',
        isPerfectMatch: true
      };
    }

    const ages = [
      '12', '13', '14', '15', '16', '17', '18', '19', '45', '46',
      '47', '48', '49', '50', '51', '52', '53', '54', '55', '56',
      '57', '58', '59', '60', '61', '62', '63', '64', '65', '66',
      '67', '68', '69', '70', '71', '72', '73', '74', '75', '76',
      '77', '78', '79', '80', '81', '82', '83', '84', '85', '86',
      '87', '88', '89', '90'
    ];

    const heights = [
      `4'11" and ¾"`, `6'8"`, `5'2" (5'7" in boots)`, `6'1" (2mm exact)`, `4'9" big boots`,
      `7'0"`, `5'0" on tiptoes`, `6'5" and a half`, `4'10" exactly`, `6'11" giraffe`,
      `5'1" in heels`, `6'7" slouching`, `4'8" with hat`, `6'9" (nice)`, `5'3.5"`,
      `6'2" in socks`, `4'7" power stance`, `7'2" door-hitter`, `5'4" posture`, `6'6" giant`,
      `4'9.5"`, `6'10" benched`, `5'5" towering`, `6'4" stretched`, `7'3" ceiling`,
      `4'6" compact`, `6'3" barefoot`, `5'6" average`, `7'1" giant`, `4'8.5"`,
      `6'0" (rounded up)`, `5'1.5"`, `6'11.5"`, `4'5" miniature`, `7'4" sky high`,
      `5'7.5"`, `6'5.5"`, `4'11.9"`, `6'8.5"`, `5'3" exact`, `6'9.5"`,
      `4'10"`, `7'5" tower`, `5'8" posture`, `6'7.5"`, `4'4" micro`,
      `6'1.8"`, `5'9" normal`, `7'6" titan`, `4'9.9"`
    ];

    const jobs = [
      'Golf Ball Diver', 'Water Slide Tester', 'Line Stander', 'Fortune Writer', 'Pet Psychic',
      'Snake Milker', 'Odor Judge', 'Paint Inspector', 'Lego Separator', 'Dice Tester',
      'Armpit Smeller', 'Chicken Sexer', 'Queue Waiter', 'Furniture Tester', 'Pro Sleeper',
      'Cat Caddy', 'Meme Historian', 'Bed Tester', 'Duck Herder', 'Dog Food Taster',
      'Worm Picker', 'Iceberg Mover', 'Towel Sniffer', 'Ant Stunt Double', 'Volcano Monitor',
      'Professional Mourner', 'Grossologist', 'Golf Caddy For Cats', 'Dinosaur Bone Duster',
      'Feng Shui Consultant For Dogs', 'Scrapple Specialist', 'Ostrich Handler', 'Wrinkle Eraser',
      'Stunt Double For Statues', 'Pigeon Chaser', 'Teddy Bear Parachutist', 'Bubble Wrap Popper',
      'Gummy Bear Sculptor', 'Toothpaste Cap Screwer', 'Cereal Sorting Analyst', 'Unicorn Breeder',
      'Professional Whisperer', 'Sock Matcher', 'Snail Race Judge', 'Traffic Cone Placer',
      'Dust Bunny Wrangler', 'Tea Leaf Reader', 'Cloud Namer', 'Avocado Ripeness Judge', 'Meme Archaeologist'
    ];

    let genders = ['Male', 'Female', 'Transgender Woman', 'Transgender Man', 'Non-binary', 'Agender'];
    const userGender = userInput?.gender;
    if (userGender === 'Male') {
      genders = genders.filter(g => g !== 'Female');
    } else if (userGender === 'Female') {
      genders = genders.filter(g => g !== 'Male');
    }

    const personalities = [
      'Fears Tupperware', 'Ranks Soup Brands', 'Eats Yellow Food', 'Quotes Old Movies', 'Competes W/ Toddlers',
      'Rates Eye Contact', 'Whispers To Plants', 'Refuses Tuesdays', 'Explains Memes', 'Counts Elevator Buttons',
      'Judges Cereal', 'Fears Toasters', 'Aggressively Polite', 'Argues With Siri', 'Ranks Spots',
      'Obsessed W/ Lint', 'Mirror Monologues', 'Rates Tap Water', 'Fears Bubble Wrap', 'Aggressively Chill',
      'Sings Microwave', 'Corrects Grammar', 'Monopolizes Trivia', 'Judges Handshakes', 'Fears Slow Wi-Fi',
      'Smells Book Pages', 'Ranks Door Knobs', 'Fears Bananas', 'Whispers To Ice', 'Counts Stairs Out Loud',
      'Rates Ceiling Fans', 'Judges Shoelaces', 'Argues With GPS', 'Obsessed W/ Receipts', 'Fears Pigeons',
      'Ranks Paper Clips', 'Talks To Houseplants', 'Evaluates Hugs', 'Fears Balloons', 'Quotes Cartoons',
      'Rates Sidewalk Cracks', 'Judges Napkins', 'Fears Static Electricity', 'Monopolizes AUX Cord',
      'Counts Car Colors', 'Rates Elevator Music', 'Fears Automatic Doors', 'Obsessed W/ Stickers',
      'Judges Toothpicks', 'Whispers To Switches'
    ];

    const hobbies = [
      'Bird Watching', 'Collecting Lint', 'Baking Micro-Pies', 'Aggressive Origami', 'Cat Pitch Tuning',
      'Synchronized Mowing', 'Sock Sorting', 'Cloud Rating', 'Extreme Ironing', 'Pencil Sharpening',
      'Spoon Balancing', 'Elevator Riding', 'Leaf Collecting', 'Brick Stacking', 'Popping Bubbles',
      'Gnome Painting', 'Dust Bun Hunting', 'Tunnel Yodeling', 'Pebble Cataloging', 'Ant Race Betting',
      'Washing Marbles', 'Staring Contests', 'Noodle Sculpting', 'Button Counting', 'Tree Hugging',
      'Bread Tag Stacking', 'Competitive Napping', 'Marble Rolling', 'Bottle Cap Sorting', 'Snail Racing',
      'Puddle Jumping', 'Toothpick Towering', 'Rubber Band Chaining', 'Ticket Stub Archiving', 'Acorn Hoarding',
      'Yarn Untangling', 'Shoelace Braiding', 'Paper Crane Folding', 'Feather Collection', 'Magnet Hunting',
      'Stamp Licking', 'Coin Stacking', 'Soap Carving', 'Stick Fighting', 'Bubble Blower Tuning',
      'Doodle Rating', 'Cereal Box Reading', 'Lint Roller Racing', 'Paper Clip Chaining', 'Shadow Puppetry'
    ];

    const greenFlags = [
      'Claps On Landing', 'Wipes On Jeans', 'Brings Spreadsheet', 'Whispers "Nice" Paying', 'Listens 2.5x Speed',
      'Asks "Who Am I?"', 'Reply-All On Emails', 'Ketchup On Tacos', 'Pizza W/ Fork', 'Leaves 1 Sec Microwave',
      'Bites Ice Cream', 'Uses Unironic Emojis', 'Says "Irregardless"', 'Socks W/ Sandals', 'Double Dips Chips',
      'Spoils Endings', 'Leaves Carts Stray', '45 Min Showers', 'Chews Ice Loudly', 'Talks Thru Movies',
      'Milk Before Cereal', 'Uses Comic Sans', 'Snoozes 12 Alarms', 'Makes Bed At 11PM', 'Claps At Movie End',
      'Puts Ketchup On Eggs', 'Eats Apple Core', 'Wears Sunglasses Inside', 'Uses Speakerphone Publicly',
      'Leaves Doors Ajar', 'Takes 100 Selfies', 'Uses Typewriter', 'Drinks Pickle Juice', 'Eats Pizza Crust First',
      'Calls Everyone "Champ"', 'Wears Crocs To Weddings', 'Types With 2 Fingers', 'Leaves Caps Off Pens',
      'Says "Supposably"', 'Licks Knife Clean', 'Unplugs Wi-Fi At Night', 'Uses Flash On Photos',
      'Takes Notes In Crayon', 'Eats Kiwi Skin', 'Humms Loudly Shopping', 'Asks For Water No Ice',
      'Wears 3 Watches', 'Brings Own Hot Sauce', 'Reads Terms Of Service', 'Claps When Elevator Arrives'
    ];

    const desperation = userInput?.desperation || 75;
    const pickFromPool = (arr) => {
      const len = arr.length;
      if (desperation >= 80) {
        const sub = arr.slice(Math.floor(len * 0.4));
        return sub[Math.floor(Math.random() * sub.length)];
      } else if (desperation <= 35) {
        const sub = arr.slice(0, Math.ceil(len * 0.6));
        return sub[Math.floor(Math.random() * sub.length)];
      }
      return arr[Math.floor(Math.random() * len)];
    };

    return {
      age: pickFromPool(ages),
      height: pickFromPool(heights),
      job: pickFromPool(jobs),
      gender: pickFromPool(genders),
      personality: pickFromPool(personalities),
      hobby: pickFromPool(hobbies),
      greenFlag: pickFromPool(greenFlags),
      isPerfectMatch: false
    };
  };

  const fetchRelationshipMatch = async (userInput) => {
    setIsLoading(true);
    setIsPredictionComplete(false);
    setError(null);
    setIsSharedView(false);
    setUserReaction(null);
    setLastUserInput(userInput);

    const newCount = attemptCount + 1;
    setAttemptCount(newCount);
    localStorage.setItem('matchAttemptCount', newCount.toString());

    const payload = { ...userInput, attemptCount: newCount };

    const targetBaseUrl = import.meta.env.VITE_API_URL || 'https://my-next-relationship.onrender.com';
    const primaryUrl = targetBaseUrl.replace(/\/$/, '') + '/api/generate';
    const secondaryUrl = 'https://my-next-relationship-api.onrender.com/api/generate';

    try {
      let response;
      try {
        response = await fetch(primaryUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (e) {
        response = await fetch(secondaryUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
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

      console.warn('Backend returned status 404 or non-OK. Using client-side match fallback.');
      setMatchData(generateClientFallback(userInput, newCount));
      setMatchSource('client_fallback');
    } catch (err) {
      console.warn('Network error reaching Express backend. Using client-side match fallback:', err);
      setMatchData(generateClientFallback(userInput, newCount));
      setMatchSource('client_fallback');
    } finally {
      setIsLoading(false);
    }
  };



  const handleCopyDeepLink = async () => {
    if (!matchData) return;
    try {
      const code = createShortMatchCode(matchData);
      const host = window.location.origin.includes('localhost') ? 'https://my-next-relationship.vercel.app' : window.location.origin;
      const shareUrl = `${host}?m=${code}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  const handleReset = () => {
    setMatchData(null);
    setError(null);
    setUserReaction(null);
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
          VER 2.0 // GEN-Z EDITION
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
            {isSharedView && (
              <div className="stark-card" style={{ background: '#FFFC00', border: '3px solid #000', marginBottom: '1.5rem', textAlign: 'center' }}>
                <h3 style={{ fontWeight: '900', fontSize: '1.1rem', color: '#000', textTransform: 'uppercase' }}>
                  🔥 YOU ARE VIEWING A FRIEND'S MATCH!
                </h3>
                <p style={{ fontSize: '0.88rem', fontWeight: '700', margin: '0.4rem 0 1rem 0' }}>
                  Want to find your own statistically improbable partner?
                </p>
                <button className="stark-button" onClick={handleReset} style={{ background: '#000', color: '#FFF' }}>
                  PREDICT MY MATCH ➔
                </button>
              </div>
            )}

            {matchData.isPerfectMatch && (
              <div className="stark-card" style={{ background: 'linear-gradient(135deg, #FFFC00 0%, #FF52A2 100%)', border: '3.5px solid #000', boxShadow: '6px 6px 0px #000', marginBottom: '1.5rem', textAlign: 'center', color: '#000' }}>
                <div className="mono-tag-badge" style={{ background: '#000', color: '#FFF', fontSize: '0.8rem', padding: '0.25rem 0.6rem', marginBottom: '0.5rem', display: 'inline-block' }}>
                  🏆 GENUINE REALISTIC MATCH UNLOCKED!
                </div>
                <h3 style={{ fontWeight: '900', fontSize: '1.3rem', textTransform: 'uppercase' }}>
                  YOU UNLOCKED THE PERFECT REALISTIC MATCH!
                </h3>
                <p style={{ fontSize: '0.9rem', fontWeight: '800', marginTop: '0.3rem' }}>
                  After {attemptCount} predictions, the universe finally took pity on you. Enjoy this genuinely compatible partner!
                </p>
              </div>
            )}

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

                {/* Reaction / Approval Buttons */}
                <div style={{
                  background: '#FFFFFF',
                  border: '3px solid #000',
                  boxShadow: '4px 4px 0px #000',
                  padding: '0.85rem 1rem',
                  marginBottom: '1rem',
                  marginTop: '1.5rem'
                }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    fontWeight: '900',
                    marginBottom: '0.6rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}>
                    <span>💬 YOUR REACTION TO THIS MATCH:</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.55rem' }}>
                    {REACTION_OPTIONS.map((opt) => {
                      const isSelected = userReaction?.id === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setUserReaction(opt)}
                          style={{
                            background: isSelected ? opt.bg : '#FFFFFF',
                            color: isSelected ? opt.color : '#333333',
                            border: isSelected ? '2.5px solid #000' : '1.5px solid #777777',
                            boxShadow: isSelected ? '3px 3px 0px #000' : 'none',
                            padding: '0.6rem 0.5rem',
                            fontSize: '0.78rem',
                            fontWeight: '900',
                            fontFamily: 'var(--font-sans)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            transform: isSelected ? 'scale(1.02)' : 'none',
                            textAlign: 'center'
                          }}
                        >
                          {opt.text}
                        </button>
                      );
                    })}
                  </div>
                </div>

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
                      onClick={() => fetchRelationshipMatch(lastUserInput || { age: 24, gender: 'Female' })}
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
              </div>
            )}

            {isShareModalOpen && (
              <SocialShareModal
                matchData={matchData}
                userInput={lastUserInput}
                matchDescription={matchDescription}
                attemptCount={attemptCount}
                userReaction={userReaction}
                onClose={() => setIsShareModalOpen(false)}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
