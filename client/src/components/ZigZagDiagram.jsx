import React, { useState, useEffect } from 'react';

export default function ZigZagDiagram({ matchData, matchSource }) {
  const [activeStep, setActiveStep] = useState(1);
  const [isDone, setIsDone] = useState(false);
  const [scrambleValue, setScrambleValue] = useState('');
  const [hoveredNode, setHoveredNode] = useState(null);

  if (!matchData) return null;

  const colors = [
    '#FFE600', // Yellow - Node 1 Age
    '#FF52A2', // Pink - Node 2 Gender
    '#00F0FF', // Cyan - Node 3 Height
    '#00E699', // Green - Node 4 Job
    '#FF7E36', // Orange - Node 5 Personality
    '#8B5CF6', // Purple - Node 6 Hobby
    '#FF3366'  // Hot Red - Node 7 Red Flag
  ];

  // Symmetrical 7-Node Wave Layout (Valley -> Peak -> Valley -> Peak -> Valley -> Peak -> Valley)
  // Compact Y bounds so the entire screen fits within 100% Chrome view without scrolling
  const nodes = [
    { id: 'age', label: 'AGE', value: matchData.age, x: 80, y: 220, cardY: 240, color: colors[0] },
    { id: 'gender', label: 'GENDER', value: matchData.gender, x: 210, y: 75, cardY: 10, color: colors[1] },
    { id: 'height', label: 'HEIGHT', value: matchData.height, x: 340, y: 220, cardY: 240, color: colors[2] },
    { id: 'job', label: 'OCCUPATION', value: matchData.job, x: 470, y: 75, cardY: 10, color: colors[3] },
    { id: 'personality', label: 'PERSONALITY', value: matchData.personality || matchData.trait, x: 600, y: 220, cardY: 240, color: colors[4] },
    { id: 'hobby', label: 'PRIMARY HOBBY', value: matchData.hobby, x: 730, y: 75, cardY: 10, color: colors[5] },
    { id: 'redFlag', label: 'RED FLAG', value: matchData.redFlag || 'Claps when airplane lands', x: 860, y: 220, cardY: 240, color: colors[6] }
  ];

  // Sample pools for real-time text scramble animation during prediction
  const scramblePools = {
    age: ['15 (Mental age 90)', '74 (Tells war stories)', '19 (Refuses adulthood)', '82 (Ex-gymnast)', '47 (Retired early)'],
    gender: ['Genderfluid', 'Agender', 'Non-binary', 'Two-Spirit', 'Demigirl', 'Transgender Woman', 'Cisgender Male'],
    height: ['4\'11" and ¾"', '6\'8"', '5\'2" (5\'7" in boots)', '7\'1"', '6\'1.5"'],
    job: ['Golf Ball Diver', 'Water Slide Tester', 'Professional Line Stander', 'Snake Milker', 'Odor Judge'],
    personality: ['Fears Tupperware', 'Ranks soup brands', 'Only eats yellow foods', 'Communicates in quotes'],
    hobby: ['Competitive bird watching', 'Collecting vintage lint', 'Baking micro-pies', 'Aggressive origami'],
    redFlag: ['Claps when airplane lands', 'Brings Excel to dates', 'Whispers "nice" when paying', 'No napkins user']
  };

  // Step timer: Move dark line from 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7
  useEffect(() => {
    setActiveStep(1);
    setIsDone(false);

    let step = 1;
    const interval = setInterval(() => {
      step++;
      if (step <= nodes.length) {
        setActiveStep(step);
      } else {
        setIsDone(true);
        clearInterval(interval);
      }
    }, 550);

    return () => clearInterval(interval);
  }, [matchData]);

  // Real-time text scrambling for the node currently being predicted
  useEffect(() => {
    if (isDone || activeStep > nodes.length) return;

    const currNode = nodes[activeStep - 1];
    const pool = scramblePools[currNode.id] || [currNode.value];

    const scrambleTimer = setInterval(() => {
      const randVal = pool[Math.floor(Math.random() * pool.length)];
      setScrambleValue(randVal);
    }, 50);

    return () => clearInterval(scrambleTimer);
  }, [activeStep, isDone]);

  // Active line points up to current predicting node
  const activeNodes = nodes.slice(0, activeStep);
  const activePolylinePoints = activeNodes.map(n => `${n.x},${n.y}`).join(' ');
  const fullPolylinePoints = nodes.map(n => `${n.x},${n.y}`).join(' ');

  return (
    <div className="diagram-container">
      {/* Header section with main title and live status tag */}
      <div className="diagram-header" style={{ marginBottom: '0.75rem', paddingBottom: '0.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
            PREDICTIVE MATCH PATH
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="match-source-badge">
            SOURCE: {matchSource === 'gemini' ? 'GEMINI API (LIVE)' : 'LOCAL SIMULATOR'}
          </span>
          <span
            className="mono-tag"
            style={{
              padding: '0.3rem 0.6rem',
              border: '2px solid #000',
              background: isDone ? 'var(--pop-green)' : 'var(--pop-yellow)',
              boxShadow: '2px 2px 0px #000',
              color: '#000'
            }}
          >
            {isDone ? '✓ MATCH PREDICTED' : `⚡ PREDICTING NODE 0${activeStep}...`}
          </span>
        </div>
      </div>

      {/* SVG Symmetrical 7-Node Wave Path Viewport (Compact Viewport Height to fit 100% zoom) */}
      <div style={{ position: 'relative', width: '100%' }}>
        <svg
          viewBox="0 0 940 320"
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        >
          <defs>
            <pattern id="dot-grid" width="18" height="18" patternUnits="userSpaceOnUse">
              <circle cx="2.5" cy="2.5" r="1.2" fill="#D6D1C0" />
            </pattern>
          </defs>

          {/* Background dot grid */}
          <rect width="940" height="320" fill="url(#dot-grid)" opacity="0.6" />

          {/* Ghost dashed path line connecting all 7 nodes */}
          <polyline
            points={fullPolylinePoints}
            fill="none"
            stroke="#D0D0D0"
            strokeWidth="3"
            strokeDasharray="5,5"
          />

          {/* Dark Active Line extending from Node 1 -> 2 -> ... -> activeStep in real time */}
          {activeNodes.length > 1 && (
            <polyline
              points={activePolylinePoints}
              fill="none"
              stroke="#000000"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Render ALL 7 Nodes at their fixed positions 1 through 7 */}
          {nodes.map((node, index) => {
            const stepNum = index + 1;
            const isReached = stepNum <= activeStep;
            const isCurrentlyPredicting = stepNum === activeStep && !isDone;
            const isHovered = hoveredNode === node.id;

            // Determine text value to display
            let displayValue = '';
            if (isDone || stepNum < activeStep) {
              displayValue = node.value;
            } else if (isCurrentlyPredicting) {
              displayValue = scrambleValue || node.value;
            } else {
              displayValue = '...';
            }

            return (
              <g
                key={node.id}
                onMouseEnter={() => (isDone || isReached) && setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  cursor: isReached ? 'pointer' : 'default',
                  transition: 'opacity 0.2s ease'
                }}
              >
                {/* Real-time pulse ring on predicting node */}
                {isCurrentlyPredicting && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="22"
                    fill="none"
                    stroke={node.color}
                    strokeWidth="3"
                  >
                    <animate attributeName="r" values="14;26;14" dur="0.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0.3;1" dur="0.8s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Fixed Node Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? 17 : 13}
                  fill={isReached ? node.color : '#FFFFFF'}
                  stroke="#000000"
                  strokeWidth="2.5"
                  style={{ transition: 'all 0.15s ease' }}
                />

                {/* Fixed Number Label (1 through 7) */}
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  fill="#000000"
                  fontSize="11"
                  fontFamily="JetBrains Mono"
                  fontWeight="900"
                  pointerEvents="none"
                >
                  {stepNum}
                </text>

                {/* Real-time Animated Parameter Box */}
                {(isReached || isCurrentlyPredicting) && (
                  <g transform={`translate(${node.x - 70}, ${node.cardY})`}>
                    {/* Shadow offset */}
                    <rect x="3" y="3" width="140" height="58" fill="#000000" />
                    {/* Card main box */}
                    <rect
                      x="0"
                      y="0"
                      width="140"
                      height="58"
                      fill={isHovered ? node.color : isCurrentlyPredicting ? '#FFFDF0' : '#FFFFFF'}
                      stroke={isCurrentlyPredicting ? node.color : '#000000'}
                      strokeWidth={isCurrentlyPredicting ? '3' : '2'}
                      style={{ transition: 'fill 0.15s ease' }}
                    />
                    {/* Parameter Tag */}
                    <text
                      x="8"
                      y="17"
                      fontFamily="JetBrains Mono"
                      fontSize="8.5"
                      fontWeight="800"
                      fill="#000000"
                      letterSpacing="0.04em"
                    >
                      0{stepNum} // {node.label}
                    </text>
                    {/* Real-time Scrambled / Final Parameter Text */}
                    <text
                      x="8"
                      y="39"
                      fontFamily="Inter"
                      fontSize="11"
                      fontWeight="800"
                      fill={isCurrentlyPredicting ? '#000000' : '#111111'}
                    >
                      {displayValue.length > 17 ? displayValue.substring(0, 15) + '...' : displayValue}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
