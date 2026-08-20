import React, { useState } from 'react';

export default function ZigZagDiagram({ matchData, matchSource }) {
  const [activeNode, setActiveNode] = useState(null);

  if (!matchData) return null;

  const nodes = [
    {
      id: 'age',
      label: 'AGE',
      value: matchData.age,
      x: 120,
      y: 90,
      align: 'right'
    },
    {
      id: 'gender',
      label: 'GENDER',
      value: matchData.gender,
      x: 420,
      y: 70,
      align: 'left'
    },
    {
      id: 'height',
      label: 'HEIGHT',
      value: matchData.height,
      x: 180,
      y: 220,
      align: 'right'
    },
    {
      id: 'job',
      label: 'OCCUPATION',
      value: matchData.job,
      x: 680,
      y: 190,
      align: 'left'
    },
    {
      id: 'personality',
      label: 'PERSONALITY',
      value: matchData.personality,
      x: 280,
      y: 360,
      align: 'right'
    },
    {
      id: 'hobby',
      label: 'PRIMARY HOBBY',
      value: matchData.hobby,
      x: 740,
      y: 380,
      align: 'left'
    }
  ];

  // Construct points string for SVG polyline (sharp zig-zag path)
  const polylinePoints = nodes.map(n => `${n.x},${n.y}`).join(' ');

  return (
    <div className="diagram-container">
      <div className="diagram-header">
        <div>
          <span className="mono-tag" style={{ color: 'var(--text-muted)' }}>02 // DIAGRAM OUTPUT</span>
          <h2 style={{ fontSize: '1.25rem', marginTop: '0.2rem' }}>YOUR MATCHED PROFILE PATH</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="match-source-badge">
            SOURCE: {matchSource === 'gemini' ? 'GEMINI API (LIVE)' : 'LOCAL SIMULATOR'}
          </span>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', minHeight: '440px' }}>
        <svg
          viewBox="0 0 900 460"
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        >
          <defs>
            <pattern id="dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#E2E2E2" />
            </pattern>
          </defs>

          {/* Background grid inside SVG */}
          <rect width="900" height="460" fill="url(#dot-grid)" opacity="0.6" />

          {/* Sharp Zig-Zag Polyline Path */}
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="#111111"
            strokeWidth="3"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />

          {/* Dash line shadow accent for depth */}
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="#AAAAAA"
            strokeWidth="1"
            strokeDasharray="4,4"
          />

          {/* Draw Circular Nodes & Crisp Labels */}
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
                  r={isHovered ? 16 : 12}
                  fill="#FFFFFF"
                  stroke="#111111"
                  strokeWidth="3"
                  style={{ transition: 'all 0.15s ease' }}
                />

                {/* Node inner dot */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? 6 : 4}
                  fill="#111111"
                />

                {/* Node step number */}
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  fill={isHovered ? "#FFFFFF" : "#111111"}
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                  fontWeight="700"
                  pointerEvents="none"
                >
                  {index + 1}
                </text>

                {/* SVG Card Container */}
                <g transform={`translate(${node.x + (node.align === 'left' ? 24 : -240)}, ${node.y - 30})`}>
                  {/* Card Background */}
                  <rect
                    width="216"
                    height="62"
                    fill={isHovered ? "#111111" : "#FFFFFF"}
                    stroke="#111111"
                    strokeWidth="1.5"
                    style={{ transition: 'fill 0.15s ease' }}
                  />

                  {/* Header Tag */}
                  <text
                    x="10"
                    y="18"
                    fontFamily="JetBrains Mono"
                    fontSize="9"
                    fontWeight="700"
                    fill={isHovered ? "#AAAAAA" : "#666666"}
                    letterSpacing="0.08em"
                  >
                    0{index + 1} // {node.label}
                  </text>

                  {/* Dynamic Parameter Value */}
                  <text
                    x="10"
                    y="42"
                    fontFamily="Inter"
                    fontSize="12"
                    fontWeight="700"
                    fill={isHovered ? "#FFFFFF" : "#111111"}
                  >
                    {node.value.length > 26 ? node.value.substring(0, 24) + '...' : node.value}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Structured Minimalist Summary Table */}
      <div style={{ marginTop: '2rem', borderTop: '2px solid var(--border-color)', paddingTop: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {nodes.map((node, i) => (
            <div
              key={node.id}
              style={{
                border: '1px solid var(--border-color)',
                padding: '0.85rem 1rem',
                background: '#FFFFFF'
              }}
            >
              <div className="mono-tag" style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                PARAM 0{i + 1}: {node.label}
              </div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                {node.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
