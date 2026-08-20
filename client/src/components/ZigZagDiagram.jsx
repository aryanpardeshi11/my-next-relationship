import React, { useState } from 'react';

export default function ZigZagDiagram({ matchData, matchSource }) {
  const [activeNode, setActiveNode] = useState(null);

  if (!matchData) return null;

  const colors = [
    '#FFE600', // Yellow
    '#FF52A2', // Pink
    '#00F0FF', // Cyan
    '#00E699', // Green
    '#FF7E36', // Orange
    '#8B5CF6'  // Purple
  ];

  const nodes = [
    {
      id: 'age',
      label: 'AGE',
      value: matchData.age,
      x: 120,
      y: 90,
      align: 'right',
      color: colors[0]
    },
    {
      id: 'gender',
      label: 'GENDER',
      value: matchData.gender,
      x: 420,
      y: 70,
      align: 'left',
      color: colors[1]
    },
    {
      id: 'height',
      label: 'HEIGHT',
      value: matchData.height,
      x: 180,
      y: 220,
      align: 'right',
      color: colors[2]
    },
    {
      id: 'job',
      label: 'OCCUPATION',
      value: matchData.job,
      x: 680,
      y: 190,
      align: 'left',
      color: colors[3]
    },
    {
      id: 'personality',
      label: 'PERSONALITY',
      value: matchData.personality,
      x: 280,
      y: 360,
      align: 'right',
      color: colors[4]
    },
    {
      id: 'hobby',
      label: 'PRIMARY HOBBY',
      value: matchData.hobby,
      x: 740,
      y: 380,
      align: 'left',
      color: colors[5]
    }
  ];

  // Construct points string for SVG polyline (sharp zig-zag path)
  const polylinePoints = nodes.map(n => `${n.x},${n.y}`).join(' ');

  return (
    <div className="diagram-container">
      <div className="diagram-header">
        <div>
          <span className="mono-tag" style={{ color: 'var(--text-muted)' }}>02 // DIAGRAM OUTPUT</span>
          <h2 style={{ fontSize: '1.3rem', marginTop: '0.2rem' }}>YOUR MATCHED PROFILE PATH</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="match-source-badge">
            SOURCE: {matchSource === 'gemini' ? 'GEMINI API (LIVE)' : 'LOCAL SIMULATOR'}
          </span>
        </div>
      </div>

      {/* Visual SVG Zig-Zag Path Diagram */}
      <div style={{ position: 'relative', width: '100%', minHeight: '440px' }}>
        <svg
          viewBox="0 0 900 460"
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        >
          <defs>
            <pattern id="dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="1.5" fill="#D6D1C0" />
            </pattern>
          </defs>

          {/* Background grid inside SVG */}
          <rect width="900" height="460" fill="url(#dot-grid)" opacity="0.7" />

          {/* Sharp Zig-Zag Polyline Path */}
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="#000000"
            strokeWidth="4"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />

          {/* Draw Circular Nodes & Pop Label Cards */}
          {nodes.map((node, index) => {
            const isHovered = activeNode === node.id;
            return (
              <g
                key={node.id}
                onMouseEnter={() => setActiveNode(node.id)}
                onMouseLeave={() => setActiveNode(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Node outer ring */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? 18 : 14}
                  fill={node.color}
                  stroke="#000000"
                  strokeWidth="3"
                  style={{ transition: 'all 0.15s ease' }}
                />

                {/* Node inner step number */}
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

                {/* SVG Card Container */}
                <g transform={`translate(${node.x + (node.align === 'left' ? 26 : -246)}, ${node.y - 32})`}>
                  {/* Card Shadow */}
                  <rect
                    x="4"
                    y="4"
                    width="220"
                    height="64"
                    fill="#000000"
                  />
                  {/* Card Main Box */}
                  <rect
                    x="0"
                    y="0"
                    width="220"
                    height="64"
                    fill={isHovered ? node.color : "#FFFFFF"}
                    stroke="#000000"
                    strokeWidth="2.5"
                    style={{ transition: 'fill 0.15s ease' }}
                  />

                  {/* Header Tag */}
                  <text
                    x="12"
                    y="20"
                    fontFamily="JetBrains Mono"
                    fontSize="10"
                    fontWeight="800"
                    fill="#000000"
                    letterSpacing="0.06em"
                  >
                    0{index + 1} // {node.label}
                  </text>

                  {/* Dynamic Parameter Value */}
                  <text
                    x="12"
                    y="44"
                    fontFamily="Inter"
                    fontSize="13"
                    fontWeight="800"
                    fill="#000000"
                  >
                    {node.value.length > 25 ? node.value.substring(0, 23) + '...' : node.value}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Horizontal Parameters Grid View for Easy Readability */}
      <div style={{ marginTop: '2rem', borderTop: '3px solid var(--border-color)', paddingTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
          03 // MATCH PARAMETERS OVERVIEW
        </h3>
        
        <div className="horizontal-flex-cards">
          {nodes.map((node, i) => (
            <div
              key={node.id}
              className="param-card"
              style={{ borderLeft: `6px solid ${node.color}` }}
            >
              <div className="param-card-header">
                <span className="param-num-badge">0{i + 1}</span>
                <span className="param-title">{node.label}</span>
              </div>
              <div className="param-value">
                {node.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
