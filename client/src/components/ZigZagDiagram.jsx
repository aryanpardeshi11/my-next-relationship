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

  // Generous Symmetrical 7-Node Layout with Extra Space Above Top Cards (2, 4, 6)
  // Top Peak Nodes at y=125, Cards placed ABOVE at cardY=25 (42px clearance margin)
  // Bottom Valley Nodes at y=275, Cards placed BELOW at cardY=315 (40px clearance margin)
  const nodes = [
    { id: 'age', label: 'AGE', value: matchData.age, x: 110, y: 275, cardY: 315, color: colors[0] },
    { id: 'gender', label: 'GENDER', value: matchData.gender, x: 240, y: 125, cardY: 25, color: colors[1] },
    { id: 'height', label: 'HEIGHT', value: matchData.height, x: 370, y: 275, cardY: 315, color: colors[2] },
    { id: 'job', label: 'OCCUPATION', value: matchData.job, x: 500, y: 125, cardY: 25, color: colors[3] },
    { id: 'personality', label: 'PERSONALITY', value: matchData.personality || matchData.trait, x: 630, y: 275, cardY: 315, color: colors[4] },
    { id: 'hobby', label: 'PRIMARY HOBBY', value: matchData.hobby, x: 760, y: 125, cardY: 25, color: colors[5] },
    { id: 'redFlag', label: 'RED FLAG', value: matchData.redFlag || 'Claps On Landing', x: 890, y: 275, cardY: 315, color: colors[6] }
  ];

  // Concise sample pools for real-time text scramble animation (all under 18 characters)
  const scramblePools = {
    age: ['14', '16', '18', '47', '62', '78', '89'],
    gender: ['Genderfluid', 'Agender', 'Non-binary', 'Two-Spirit', 'Demigirl', 'Transgender', 'Cisgender Male'],
    height: ['4\'11" and ¾"', '6\'8"', '5\'2" (5\'7" in boots)', '7\'1"', '6\'1.5"'],
    job: ['Golf Ball Diver', 'Water Slide Tester', 'Line Stander', 'Snake Milker', 'Odor Judge'],
    personality: ['Fears Tupperware', 'Ranks Soup Brands', 'Eats Yellow Food', 'Quotes Old Movies'],
    hobby: ['Bird Watching', 'Collecting Lint', 'Baking Micro-Pies', 'Aggressive Origami'],
    redFlag: ['Claps On Landing', 'Brings Spreadsheet', 'Whispers "Nice" Paying', 'Wipes On Jeans']
  };

  // Prediction step timer: 1.2s per node for clear prediction watching
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

  // Active line points extending up to current predicting node
  const activeNodes = nodes.slice(0, activeStep);
  const activePolylinePoints = activeNodes.map(n => `${n.x},${n.y}`).join(' ');
  const fullPolylinePoints = nodes.map(n => `${n.x},${n.y}`).join(' ');

  return (
    <div className="diagram-container">
      {/* Header section with main title and live status tag */}
      <div className="diagram-header" style={{ marginBottom: '1.25rem', paddingBottom: '0.4rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '900', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
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

      {/* SVG Symmetrical 7-Node Wave Viewport with Extra Top Clearance & Spacey Layout */}
      <div style={{ position: 'relative', width: '100%' }}>
        <svg
          viewBox="0 0 1000 420"
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        >
          <defs>
            <pattern id="dot-grid" width="18" height="18" patternUnits="userSpaceOnUse">
              <circle cx="2.5" cy="2.5" r="1.2" fill="#D6D1C0" />
            </pattern>
          </defs>

          {/* Background dot grid */}
          <rect width="1000" height="420" fill="url(#dot-grid)" opacity="0.6" />

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
            let textValue = '';
            if (isDone || stepNum < activeStep) {
              textValue = node.value;
            } else if (isCurrentlyPredicting) {
              textValue = scrambleValue || node.value;
            } else {
              textValue = '...';
            }

            // Strip parenthetical comments from Age node (e.g. "14 (Mental age 65)" -> "14")
            if (node.id === 'age' && textValue !== '...') {
              textValue = textValue.replace(/\s*\(.*?\)/g, '').trim();
            }

            // Ensure string is strictly formatted under 20 chars to guarantee 100% uniform font size
            const formattedText = textValue.length > 20 ? textValue.substring(0, 18) + '...' : textValue;

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

                {/* Real-time Animated Uniform Parameter Box (200px wide, centered on Node with ZERO Overlap) */}
                {(isReached || isCurrentlyPredicting) && (
                  <g transform={`translate(${node.x - 100}, ${node.cardY})`}>
                    {/* Shadow offset */}
                    <rect x="3.5" y="3.5" width="200" height="58" fill="#000000" />
                    {/* Card main box */}
                    <rect
                      x="0"
                      y="0"
                      width="200"
                      height="58"
                      fill={isHovered ? node.color : isCurrentlyPredicting ? '#FFFDF0' : '#FFFFFF'}
                      stroke={isCurrentlyPredicting ? node.color : '#000000'}
                      strokeWidth={isCurrentlyPredicting ? '3.5' : '2.5'}
                      style={{ transition: 'fill 0.15s ease' }}
                    />
                    {/* Parameter Tag */}
                    <text
                      x="12"
                      y="18"
                      fontFamily="JetBrains Mono"
                      fontSize="9"
                      fontWeight="800"
                      fill="#000000"
                      letterSpacing="0.04em"
                    >
                      0{stepNum} // {node.label}
                    </text>

                    {/* Age Parameter with Underline, or Standard Concise Text */}
                    {node.id === 'age' && formattedText !== '...' ? (
                      <g>
                        <text
                          x="12"
                          y="39"
                          fontFamily="Inter"
                          fontSize="13"
                          fontWeight="900"
                          fill="#000000"
                        >
                          {formattedText}
                        </text>
                        <line
                          x1="12"
                          y1="43"
                          x2={12 + formattedText.length * 10}
                          y2="43"
                          stroke="#000000"
                          strokeWidth="2.5"
                        />
                      </g>
                    ) : (
                      <text
                        x="12"
                        y="39"
                        fontFamily="Inter"
                        fontSize="11"
                        fontWeight="800"
                        fill="#000000"
                      >
                        {formattedText}
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
