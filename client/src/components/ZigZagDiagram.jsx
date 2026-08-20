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

  // Vertically wider 7-Node Wave Layout with ZERO Card-Node Overlap
  // Peak Nodes (2, 4, 6) at y=80 (Cards placed ABOVE at cardY=12)
  // Valley Nodes (1, 3, 5, 7) at y=260 (Cards placed BELOW at cardY=285)
  // Vertical amplitude = 180px for a dramatic, clean symmetrical wave
  const nodes = [
    { id: 'age', label: 'AGE', value: matchData.age, x: 100, y: 260, cardY: 285, color: colors[0] },
    { id: 'gender', label: 'GENDER', value: matchData.gender, x: 230, y: 80, cardY: 12, color: colors[1] },
    { id: 'height', label: 'HEIGHT', value: matchData.height, x: 360, y: 260, cardY: 285, color: colors[2] },
    { id: 'job', label: 'OCCUPATION', value: matchData.job, x: 490, y: 80, cardY: 12, color: colors[3] },
    { id: 'personality', label: 'PERSONALITY', value: matchData.personality || matchData.trait, x: 620, y: 260, cardY: 285, color: colors[4] },
    { id: 'hobby', label: 'PRIMARY HOBBY', value: matchData.hobby, x: 750, y: 80, cardY: 12, color: colors[5] },
    { id: 'redFlag', label: 'RED FLAG', value: matchData.redFlag || 'Claps On Plane Landing', x: 880, y: 260, cardY: 285, color: colors[6] }
  ];

  // Concise sample pools for real-time text scramble animation
  const scramblePools = {
    age: ['15 (Mental age 90)', '74 (Tells war stories)', '19 (Refuses adulthood)', '82 (Ex-gymnast)', '47 (Retired early)'],
    gender: ['Genderfluid', 'Agender', 'Non-binary', 'Two-Spirit', 'Demigirl', 'Transgender Woman', 'Cisgender Male'],
    height: ['4\'11" and ¾"', '6\'8"', '5\'2" (5\'7" in boots)', '7\'1"', '6\'1.5"'],
    job: ['Golf Ball Diver', 'Water Slide Tester', 'Professional Line Stander', 'Snake Milker', 'Odor Judge'],
    personality: ['Fears Tupperware', 'Ranks Soup Brands', 'Only Eats Yellow Food', 'Quotes Old Movies'],
    hobby: ['Bird Watching', 'Collecting Lint', 'Baking Micro-Pies', 'Aggressive Origami'],
    redFlag: ['Claps On Plane Landing', 'Brings Date Spreadsheet', 'Whispers "Nice" Paying', 'Wipes On Jeans']
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
      <div className="diagram-header" style={{ marginBottom: '0.5rem', paddingBottom: '0.4rem' }}>
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

      {/* SVG Vertically Wider 7-Node Symmetrical Wave Viewport */}
      <div style={{ position: 'relative', width: '100%' }}>
        <svg
          viewBox="0 0 980 355"
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        >
          <defs>
            <pattern id="dot-grid" width="18" height="18" patternUnits="userSpaceOnUse">
              <circle cx="2.5" cy="2.5" r="1.2" fill="#D6D1C0" />
            </pattern>
          </defs>

          {/* Background dot grid */}
          <rect width="980" height="355" fill="url(#dot-grid)" opacity="0.6" />

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

                {/* Real-time Animated Uniform Parameter Box (Centered over/under Node with ZERO Overlap) */}
                {(isReached || isCurrentlyPredicting) && (
                  <g transform={`translate(${node.x - 90}, ${node.cardY})`}>
                    {/* Shadow offset */}
                    <rect x="3.5" y="3.5" width="180" height="56" fill="#000000" />
                    {/* Card main box */}
                    <rect
                      x="0"
                      y="0"
                      width="180"
                      height="56"
                      fill={isHovered ? node.color : isCurrentlyPredicting ? '#FFFDF0' : '#FFFFFF'}
                      stroke={isCurrentlyPredicting ? node.color : '#000000'}
                      strokeWidth={isCurrentlyPredicting ? '3.5' : '2.5'}
                      style={{ transition: 'fill 0.15s ease' }}
                    />
                    {/* Parameter Tag */}
                    <text
                      x="10"
                      y="17"
                      fontFamily="JetBrains Mono"
                      fontSize="8.5"
                      fontWeight="800"
                      fill="#000000"
                      letterSpacing="0.04em"
                    >
                      0{stepNum} // {node.label}
                    </text>
                    {/* Real-time Parameter Concise Text (Fits uniformly inside box) */}
                    <text
                      x="10"
                      y="38"
                      fontFamily="Inter"
                      fontSize={textValue.length > 20 ? '10.5' : '11.5'}
                      fontWeight="800"
                      fill="#000000"
                    >
                      {textValue}
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
