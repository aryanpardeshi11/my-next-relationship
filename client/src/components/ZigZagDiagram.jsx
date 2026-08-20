import React, { useState, useEffect } from 'react';

// Helper function to split text into 2 clean lines so 100% of the sentence is displayed without truncation
function formatTextLines(text, maxLineLength = 22) {
  if (!text) return [''];
  if (text.length <= maxLineLength) return [text];

  const words = text.split(' ');
  let line1 = '';
  let line2 = '';

  for (const word of words) {
    if ((line1 + ' ' + word).trim().length <= maxLineLength) {
      line1 = (line1 + ' ' + word).trim();
    } else {
      line2 = (line2 + ' ' + word).trim();
    }
  }
  return [line1, line2 || ''];
}

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

  // Symmetrical 7-Node Wave Layout with ZERO Overlap
  // Peak Nodes (2, 4, 6) at y=120, Cards placed ABOVE at cardY=25
  // Valley Nodes (1, 3, 5, 7) at y=240, Cards placed BELOW at cardY=268
  const nodes = [
    { id: 'age', label: 'AGE', value: matchData.age, x: 110, y: 240, cardY: 268, color: colors[0] },
    { id: 'gender', label: 'GENDER', value: matchData.gender, x: 240, y: 120, cardY: 25, color: colors[1] },
    { id: 'height', label: 'HEIGHT', value: matchData.height, x: 370, y: 240, cardY: 268, color: colors[2] },
    { id: 'job', label: 'OCCUPATION', value: matchData.job, x: 500, y: 120, cardY: 25, color: colors[3] },
    { id: 'personality', label: 'PERSONALITY', value: matchData.personality || matchData.trait, x: 630, y: 240, cardY: 268, color: colors[4] },
    { id: 'hobby', label: 'PRIMARY HOBBY', value: matchData.hobby, x: 760, y: 120, cardY: 25, color: colors[5] },
    { id: 'redFlag', label: 'RED FLAG', value: matchData.redFlag || 'Claps when airplane lands', x: 890, y: 240, cardY: 268, color: colors[6] }
  ];

  // Sample pools for real-time text scramble animation during prediction
  const scramblePools = {
    age: ['15 (Mental age 90)', '74 (Tells war stories)', '19 (Refuses adulthood)', '82 (Ex-gymnast)', '47 (Retired early)'],
    gender: ['Genderfluid', 'Agender', 'Non-binary', 'Two-Spirit', 'Demigirl', 'Transgender Woman', 'Cisgender Male'],
    height: ['4\'11" and ¾"', '6\'8"', '5\'2" (5\'7" in boots)', '7\'1"', '6\'1.5"'],
    job: ['Golf Ball Diver', 'Water Slide Tester', 'Professional Line Stander', 'Snake Milker', 'Odor Judge'],
    personality: ['Fears Tupperware and whispers', 'Ranks soup brands obsessively', 'Only eats yellow foods', 'Communicates in movie quotes'],
    hobby: ['Competitive bird watching', 'Collecting vintage lint', 'Baking micro-pies', 'Aggressive origami'],
    redFlag: ['Claps when airplane lands', 'Brings Excel to dates', 'Whispers "nice" when paying', 'No napkins wipes on jeans']
  };

  // Prediction animation timer: 1.2s per node for a clear, readable prediction pace
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
    }, 1200);

    return () => clearInterval(interval);
  }, [matchData]);

  // Real-time text scrambling while predicting active node
  useEffect(() => {
    if (isDone || activeStep > nodes.length) return;

    const currNode = nodes[activeStep - 1];
    const pool = scramblePools[currNode.id] || [currNode.value];

    const scrambleTimer = setInterval(() => {
      const randVal = pool[Math.floor(Math.random() * pool.length)];
      setScrambleValue(randVal);
    }, 90);

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

      {/* SVG Symmetrical 7-Node Wave Path Viewport */}
      <div style={{ position: 'relative', width: '100%' }}>
        <svg
          viewBox="0 0 1000 360"
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        >
          <defs>
            <pattern id="dot-grid" width="18" height="18" patternUnits="userSpaceOnUse">
              <circle cx="2.5" cy="2.5" r="1.2" fill="#D6D1C0" />
            </pattern>
          </defs>

          {/* Background dot grid */}
          <rect width="1000" height="360" fill="url(#dot-grid)" opacity="0.6" />

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
              strokeWidth="4.5"
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
            let rawText = '';
            if (isDone || stepNum < activeStep) {
              rawText = node.value;
            } else if (isCurrentlyPredicting) {
              rawText = scrambleValue || node.value;
            } else {
              rawText = '...';
            }

            const lines = formatTextLines(rawText, 22);

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
                    strokeWidth="3.5"
                  >
                    <animate attributeName="r" values="15;27;15" dur="1s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0.2;1" dur="1s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Fixed Node Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? 18 : 14}
                  fill={isReached ? node.color : '#FFFFFF'}
                  stroke="#000000"
                  strokeWidth="3"
                  style={{ transition: 'all 0.15s ease' }}
                />

                {/* Fixed Number Label (1 through 7) */}
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  fill="#000000"
                  fontSize="12"
                  fontFamily="JetBrains Mono"
                  fontWeight="900"
                  pointerEvents="none"
                >
                  {stepNum}
                </text>

                {/* Real-time Animated Parameter Box (Centered over/under Node with ZERO Overlap) */}
                {(isReached || isCurrentlyPredicting) && (
                  <g transform={`translate(${node.x - 100}, ${node.cardY})`}>
                    {/* Shadow offset */}
                    <rect x="4" y="4" width="200" height="68" fill="#000000" />
                    {/* Card main box */}
                    <rect
                      x="0"
                      y="0"
                      width="200"
                      height="68"
                      fill={isHovered ? node.color : isCurrentlyPredicting ? '#FFFDF0' : '#FFFFFF'}
                      stroke={isCurrentlyPredicting ? node.color : '#000000'}
                      strokeWidth={isCurrentlyPredicting ? '3.5' : '2.5'}
                      style={{ transition: 'fill 0.15s ease' }}
                    />
                    {/* Parameter Tag */}
                    <text
                      x="10"
                      y="18"
                      fontFamily="JetBrains Mono"
                      fontSize="9"
                      fontWeight="800"
                      fill="#000000"
                      letterSpacing="0.05em"
                    >
                      0{stepNum} // {node.label}
                    </text>
                    {/* Real-time Parameter Sentence (Line 1) */}
                    <text
                      x="10"
                      y="38"
                      fontFamily="Inter"
                      fontSize="11.5"
                      fontWeight="800"
                      fill="#000000"
                    >
                      {lines[0]}
                    </text>
                    {/* Real-time Parameter Sentence (Line 2 if multi-line) */}
                    {lines[1] && (
                      <text
                        x="10"
                        y="54"
                        fontFamily="Inter"
                        fontSize="11.5"
                        fontWeight="800"
                        fill="#000000"
                      >
                        {lines[1]}
                      </text>
                    )}
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
