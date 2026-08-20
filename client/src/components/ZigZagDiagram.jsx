import React, { useState, useEffect } from 'react';

export default function ZigZagDiagram({ matchData, matchSource }) {
  const [visibleCount, setVisibleCount] = useState(1);
  const [hoveredNode, setHoveredNode] = useState(null);

  if (!matchData) return null;

  const colors = [
    '#FFE600', // Yellow - Node 1 Age
    '#FF52A2', // Pink - Node 2 Gender
    '#00F0FF', // Cyan - Node 3 Height
    '#00E699', // Green - Node 4 Job
    '#FF7E36', // Orange - Node 5 Personality
    '#8B5CF6', // Purple - Node 6 Hobby
    '#FF3366'  // Red/Hot Pink - Node 7 Red Flag
  ];

  // Symmetrical 7-node wave layout (Valley -> Peak -> Valley -> Peak -> Valley -> Peak -> Valley)
  const nodes = [
    { id: 'age', label: 'AGE', value: matchData.age, x: 85, y: 300, cardY: 330, color: colors[0] },
    { id: 'gender', label: 'GENDER', value: matchData.gender, x: 215, y: 110, cardY: 20, color: colors[1] },
    { id: 'height', label: 'HEIGHT', value: matchData.height, x: 345, y: 300, cardY: 330, color: colors[2] },
    { id: 'job', label: 'OCCUPATION', value: matchData.job, x: 475, y: 110, cardY: 20, color: colors[3] },
    { id: 'personality', label: 'PERSONALITY', value: matchData.personality || matchData.trait, x: 605, y: 300, cardY: 330, color: colors[4] },
    { id: 'hobby', label: 'PRIMARY HOBBY', value: matchData.hobby, x: 735, y: 110, cardY: 20, color: colors[5] },
    { id: 'redFlag', label: 'MAJOR RED FLAG', value: matchData.redFlag || 'Claps when airplane lands', x: 865, y: 300, cardY: 330, color: colors[6] }
  ];

  // Animate node prediction sequentially 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7
  useEffect(() => {
    setVisibleCount(1);
    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev < nodes.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 600);

    return () => clearInterval(interval);
  }, [matchData]);

  const isComplete = visibleCount === nodes.length;
  const animatedNodes = nodes.slice(0, visibleCount);
  const activePolylinePoints = animatedNodes.map(n => `${n.x},${n.y}`).join(' ');
  const fullPolylinePoints = nodes.map(n => `${n.x},${n.y}`).join(' ');

  return (
    <div className="diagram-container">
      {/* Header section with main large title PREDICTIVE MATCH PATH */}
      <div className="diagram-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '900', letterSpacing: '0.02em' }}>
            PREDICTIVE MATCH PATH
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="match-source-badge">
            SOURCE: {matchSource === 'gemini' ? 'GEMINI API (LIVE)' : 'LOCAL SIMULATOR'}
          </span>
          <span
            className="mono-tag"
            style={{
              padding: '0.35rem 0.75rem',
              border: '2.5px solid #000',
              background: isComplete ? 'var(--pop-green)' : 'var(--pop-yellow)',
              boxShadow: '2.5px 2.5px 0px #000',
              color: '#000'
            }}
          >
            {isComplete ? '✓ MATCH PREDICTED' : `⚡ PREDICTING NODE 0${visibleCount}...`}
          </span>
        </div>
      </div>

      {/* SVG Symmetrical 7-Node Wave Path Viewport */}
      <div style={{ position: 'relative', width: '100%', minHeight: '440px' }}>
        <svg
          viewBox="0 0 950 440"
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        >
          <defs>
            <pattern id="dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="1.5" fill="#D6D1C0" />
            </pattern>
          </defs>

          {/* Background dot grid */}
          <rect width="950" height="440" fill="url(#dot-grid)" opacity="0.7" />

          {/* Full path ghost line */}
          <polyline
            points={fullPolylinePoints}
            fill="none"
            stroke="#CCCCCC"
            strokeWidth="3"
            strokeDasharray="6,6"
          />

          {/* Active Animated Polyline Path */}
          {animatedNodes.length > 1 && (
            <polyline
              points={activePolylinePoints}
              fill="none"
              stroke="#000000"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Render Nodes & Cards */}
          {nodes.map((node, index) => {
            const isVisible = index < visibleCount;
            const isCurrentPredicting = index === visibleCount - 1 && !isComplete;
            const isHovered = hoveredNode === node.id;

            return (
              <g
                key={node.id}
                onMouseEnter={() => isVisible && setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  cursor: isVisible ? 'pointer' : 'default',
                  opacity: isVisible ? 1 : 0.35,
                  transition: 'opacity 0.3s ease'
                }}
              >
                {/* Pulsing ring for current predicting node */}
                {isCurrentPredicting && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="24"
                    fill="none"
                    stroke={node.color}
                    strokeWidth="3.5"
                    opacity="0.8"
                  >
                    <animate
                      attributeName="r"
                      values="16;28;16"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="1;0.2;1"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Outer Node Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? 18 : 14}
                  fill={isVisible ? node.color : '#FFFFFF'}
                  stroke="#000000"
                  strokeWidth="3"
                  style={{ transition: 'all 0.15s ease' }}
                />

                {/* Inner Step Index */}
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
                  {index + 1}
                </text>

                {/* Dynamic Parameter Card (Only shown once reached by prediction animation) */}
                {isVisible && (
                  <g transform={`translate(${node.x - 90}, ${node.cardY})`}>
                    {/* Shadow offset */}
                    <rect
                      x="4"
                      y="4"
                      width="180"
                      height="66"
                      fill="#000000"
                    />
                    {/* Card box */}
                    <rect
                      x="0"
                      y="0"
                      width="180"
                      height="66"
                      fill={isHovered ? node.color : '#FFFFFF'}
                      stroke="#000000"
                      strokeWidth="2.5"
                      style={{ transition: 'fill 0.15s ease' }}
                    />
                    {/* Label */}
                    <text
                      x="10"
                      y="20"
                      fontFamily="JetBrains Mono"
                      fontSize="9"
                      fontWeight="800"
                      fill="#000000"
                      letterSpacing="0.05em"
                    >
                      0{index + 1} // {node.label}
                    </text>
                    {/* Value */}
                    <text
                      x="10"
                      y="44"
                      fontFamily="Inter"
                      fontSize="12"
                      fontWeight="800"
                      fill="#000000"
                    >
                      {node.value.length > 22 ? node.value.substring(0, 20) + '...' : node.value}
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
