import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';

const THEMES = [
  { id: 'yellow', name: '💛 NEO YELLOW', bg: '#FFE600', text: '#000' },
  { id: 'pink', name: '🩷 CYBER PINK', bg: '#FF52A2', text: '#FFF' },
  { id: 'green', name: '💚 TOXIC GREEN', bg: '#00FF66', text: '#000' },
  { id: 'cyan', name: '🩵 HYPER CYAN', bg: '#00E5FF', text: '#000' },
  { id: 'goth', name: '🖤 DARK GOTH', bg: '#121212', text: '#FFF' }
];

export default function SocialShareModal({ matchData, userInput, matchDescription, attemptCount, userReaction, onClose }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const snapCardRef = useRef(null);

  const displayHost = (typeof window !== 'undefined' && window.location.host && window.location.host.includes('vercel.app'))
    ? window.location.host
    : 'my-next-relationship.vercel.app';

  const getContrastingStyle = (baseStyle, themeId) => {
    let { bg, color } = baseStyle || { bg: '#FFFC00', color: '#000' };
    if ((bg === '#FFFC00' || bg === '#FFE600') && themeId === 'yellow') {
      bg = '#00E5FF';
      color = '#000000';
    } else if (bg === '#FF52A2' && themeId === 'pink') {
      bg = '#00FF66';
      color = '#000000';
    } else if (bg === '#00E5FF' && themeId === 'cyan') {
      bg = '#FF52A2';
      color = '#FFFFFF';
    } else if (themeId === 'goth' && (bg === '#A060FF' || bg === '#8B5CF6' || bg === '#121212' || bg === '#000000')) {
      bg = '#FFFC00';
      color = '#000000';
    }
    return { bg, color };
  };

  const renderDesperationProgressBar = (desperationValue, themeId, isMini = false) => {
    const val = desperationValue || 75;
    const label = getDesperationLabel(val);

    // Dynamic contrast color selection to guarantee pop against card background
    let boxBg = '#FFFC00'; // Default Neo Yellow container box
    if (themeId === 'yellow') boxBg = '#00E5FF'; // Hyper Cyan box on yellow card
    if (themeId === 'cyan') boxBg = '#FF52A2';   // Cyber Pink box on cyan card
    if (themeId === 'pink') boxBg = '#00FF66';   // Toxic Green box on pink card
    if (themeId === 'goth') boxBg = '#FFFC00';   // Neo Yellow box on dark goth card

    let fillGradient = 'linear-gradient(90deg, #FFFC00 0%, #FF52A2 100%)';
    if (val >= 86) fillGradient = 'linear-gradient(90deg, #FF52A2 0%, #FF0000 100%)';
    else if (val <= 35) fillGradient = 'linear-gradient(90deg, #00FF66 0%, #00E5FF 100%)';

    return (
      <div style={{
        background: boxBg,
        border: isMini ? '1.5px solid #000' : '2.5px solid #000',
        boxShadow: isMini ? '2px 2px 0px #000' : '3px 3px 0px #000',
        padding: isMini ? '0.35rem 0.45rem' : '0.5rem 0.75rem',
        margin: isMini ? '0.35rem 0' : '0.6rem 0',
        color: '#000'
      }}>
        <div style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          width: '100%',
          fontSize: isMini ? '0.68rem' : '0.8rem',
          fontFamily: 'var(--font-mono)',
          fontWeight: '900',
          marginBottom: isMini ? '0.25rem' : '0.35rem',
          textTransform: 'uppercase',
          letterSpacing: '0.4px'
        }}>
          <span style={{ flexShrink: 0 }}>🎚️ DESPERATION METER</span>
          <span style={{
            background: '#000',
            color: '#FFF',
            padding: '0.08rem 0.4rem',
            borderRadius: '3px',
            fontSize: isMini ? '0.65rem' : '0.75rem',
            marginLeft: 'auto',
            textAlign: 'right',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}>
            {label}
          </span>
        </div>

        {/* Visual Progress Bar Component */}
        <div style={{
          width: '100%',
          height: isMini ? '12px' : '18px',
          background: '#FFFFFF',
          border: isMini ? '1.5px solid #000' : '2px solid #000',
          borderRadius: '6px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            width: `${val}%`,
            height: '100%',
            background: fillGradient,
            borderRight: val < 100 ? (isMini ? '1.5px solid #000' : '2px solid #000') : 'none'
          }} />
        </div>
      </div>
    );
  };

  const createShortCode = (match) => {
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

  useEffect(() => {
    const targetUrl = 'https://my-next-relationship.vercel.app';

    QRCode.toDataURL(targetUrl, {
      width: 160,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code:', err));
  }, []);

  const generateCanvasImage = async () => {
    if (!snapCardRef.current) return null;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(snapCardRef.current, {
        scale: 2,
        backgroundColor: selectedTheme.bg,
        useCORS: true,
        logging: false,
        width: 540,
        height: 960,
        windowWidth: 540,
        windowHeight: 960
      });
      return canvas;
    } catch (err) {
      console.error('Failed to generate snap image', err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNativeShare = async () => {
    const canvas = await generateCanvasImage();
    const shareUrl = 'https://my-next-relationship.vercel.app';
    const shareCaption = `🔥 MY NEXT RELATIONSHIP MATCH! Predict yours at: ${shareUrl}`;

    if (canvas && navigator.share) {
      try {
        canvas.toBlob(async (blob) => {
          if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], 'match-snap.png', { type: 'image/png' })] })) {
            const file = new File([blob], 'match-snap.png', { type: 'image/png' });
            try {
              await navigator.share({
                title: 'My Next Relationship',
                text: shareCaption,
                url: shareUrl,
                files: [file]
              });
            } catch (err) {
              await navigator.share({
                title: 'My Next Relationship',
                files: [file]
              });
            }
          } else {
            await navigator.share({
              title: 'My Next Relationship',
              text: shareCaption,
              url: shareUrl
            });
          }
        }, 'image/png');
      } catch (e) {
        console.log('Share dismissed or failed', e);
      }
    } else {
      handleDownloadImage();
    }
  };

  const handleDownloadImage = async () => {
    const canvas = await generateCanvasImage();
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `my-next-relationship-snap.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <h3>👻 POST TO SNAPCHAT / INSTAGRAM</h3>
          <button className="close-modal-btn" onClick={onClose}>✕</button>
        </div>

        {/* Theme Color Picker */}
        <div className="theme-picker-row">
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: '900', color: '#333' }}>
            🎨 STORY THEME:
          </span>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme)}
                style={{
                  background: theme.bg,
                  color: theme.text,
                  border: selectedTheme.id === theme.id ? '2.5px solid #000' : '1.5px solid #666',
                  boxShadow: selectedTheme.id === theme.id ? '2.5px 2.5px 0px #000' : 'none',
                  padding: '0.25rem 0.55rem',
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transform: selectedTheme.id === theme.id ? 'scale(1.05)' : 'none'
                }}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>

        {/* Hidden Snap Story Card (Formatted as 9:16 Vertical Story Image for Snapchat) */}
        <div style={{ position: 'fixed', left: '-9999px', top: 0, width: '540px', height: '960px', zIndex: -9999, pointerEvents: 'none' }}>
          <div ref={snapCardRef} className="snap-story-card" style={{ background: selectedTheme.bg }}>
            <div className="snap-card-title-box">
              <div className="snap-card-title-text">
                MY NEXT<br />RELATIONSHIP
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginLeft: 'auto' }}>
                {attemptCount && (
                  <div style={{
                    background: '#000000',
                    color: '#FFFC00',
                    border: '2px solid #FFFFFF',
                    boxShadow: '2.5px 2.5px 0px #000000',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '4px',
                    textAlign: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '900',
                    lineHeight: '1.25'
                  }}>
                    <div style={{ fontSize: '0.6rem', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PREDICTION</div>
                    <div style={{ fontSize: '0.92rem', color: '#FFFC00', fontWeight: '900' }}>ATTEMPT #{attemptCount}</div>
                  </div>
                )}

                {qrDataUrl && (
                  <div className="snap-qr-wrapper">
                    <img src={qrDataUrl} alt="Scan QR Code" className="snap-qr-img" />
                    <span className="snap-qr-label">SCAN ME</span>
                  </div>
                )}
              </div>
            </div>

            {userInput && (userInput.age || userInput.gender) && (
              <div className="snap-seeker-banner">
                <span className="seeker-tag">🎯 SEEKER PROFILE</span>
                <div className="seeker-info">
                  👤 <strong>YOU:</strong> {userInput.age} y/o {userInput.gender}
                  <span className="seeker-vs"> ➔ </span>
                  💖 <strong>MATCH:</strong> {matchData.age} y/o {matchData.gender}
                </div>
              </div>
            )}

            {userReaction && (() => {
              const rxStyle = getContrastingStyle({ bg: userReaction.bg, color: userReaction.color }, selectedTheme.id);
              return (
                <div style={{
                  background: rxStyle.bg,
                  color: rxStyle.color,
                  border: '3.5px solid #000',
                  boxShadow: '4px 4px 0px #000',
                  padding: '0.45rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '900',
                  fontSize: '0.88rem'
                }}>
                  <span>💬 MY REACTION:</span>
                  <span style={{ background: '#000', color: '#FFF', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>
                    "{userReaction.text}"
                  </span>
                </div>
              );
            })()}

            {/* Visual Desperation Progress Bar */}
            {renderDesperationProgressBar(userInput?.desperation, selectedTheme.id, false)}

            <div className="snap-params-grid">
              <div className="snap-param-item"><strong>AGE:</strong> {matchData.age}</div>
              <div className="snap-param-item"><strong>GENDER:</strong> {matchData.gender}</div>
              <div className="snap-param-item"><strong>HEIGHT:</strong> {matchData.height}</div>
              <div className="snap-param-item"><strong>OCCUPATION:</strong> {matchData.job}</div>
              <div className="snap-param-item"><strong>TRAIT:</strong> {matchData.personality || matchData.trait}</div>
              <div className="snap-param-item"><strong>HOBBY:</strong> {matchData.hobby}</div>
              <div className="snap-param-item"><strong>FLAG:</strong> {matchData.greenFlag || matchData.redFlag}</div>
            </div>

            {matchDescription && (
              <div className="snap-story-box">
                <div className="snap-story-tag">🔮 SARCASTIC MATCH IMAGINATION</div>
                <p>"{matchDescription}"</p>
              </div>
            )}

            <div className="snap-card-footer">
              🔗 SCAN QR OR VISIT: <strong>{displayHost}</strong>
            </div>
          </div>
        </div>

        {/* Visual Preview & Share Actions */}
        <div className="snap-preview-container">
          <div className="snap-preview-box">
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: '800', marginBottom: '0.5rem', color: '#555' }}>
              📱 SNAPCHAT STORY PREVIEW (9:16 CARD)
            </div>
            <div className="mini-snap-card" style={{ background: selectedTheme.bg, color: selectedTheme.text, border: '3px solid #000', boxShadow: '4px 4px 0px #000' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <div style={{ fontWeight: '900', fontSize: '0.95rem', color: selectedTheme.text }}>MY NEXT RELATIONSHIP</div>
                {attemptCount && (
                  <span style={{ background: '#000000', color: '#FFFC00', border: '1.5px solid #000', padding: '0.1rem 0.35rem', fontSize: '0.65rem', fontWeight: '900', fontFamily: 'var(--font-mono)' }}>
                    ATTEMPT #{attemptCount}
                  </span>
                )}
              </div>
              {userInput && (userInput.age || userInput.gender) && (
                <div style={{ background: '#FFFC00', border: '1.5px solid #000', padding: '0.25rem 0.4rem', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.4rem', color: '#000' }}>
                  🎯 <strong>YOU:</strong> {userInput.age} y/o {userInput.gender} ➔ 💖 <strong>MATCH:</strong> {matchData.age} y/o {matchData.gender}
                </div>
              )}

              {userReaction && (() => {
                const rxStyle = getContrastingStyle({ bg: userReaction.bg, color: userReaction.color }, selectedTheme.id);
                return (
                  <div style={{
                    background: rxStyle.bg,
                    color: rxStyle.color,
                    border: '1.5px solid #000',
                    padding: '0.2rem 0.4rem',
                    fontSize: '0.72rem',
                    fontWeight: '900',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: '0.4rem',
                    display: 'flex',
                    justify: 'space-between'
                  }}>
                    <span>💬 REACTION:</span>
                    <span>"{userReaction.text}"</span>
                  </div>
                );
              })()}

              {/* Visual Desperation Progress Bar in Mini Preview */}
              {renderDesperationProgressBar(userInput?.desperation, selectedTheme.id, true)}

              <div style={{ fontSize: '0.82rem', lineHeight: '1.4', fontWeight: '700' }}>
                👤 {matchData.age} y/o {matchData.gender} ({matchData.height})<br />
                💼 {matchData.job}<br />
                🎭 {matchData.personality || matchData.trait}<br />
                🎨 {matchData.hobby}
              </div>
              {matchDescription && (
                <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#FFFFFF', border: '1.5px solid #000', fontSize: '0.78rem', fontStyle: 'italic', color: '#000000' }}>
                  "{matchDescription}"
                </div>
              )}
              <div style={{ marginTop: '0.5rem', background: '#FFFFFF', border: '1.5px solid #000', padding: '0.35rem 0.5rem', fontSize: '0.72rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#000', textAlign: 'center' }}>
                🔗 TRY YOUR'S AT: {displayHost}
              </div>
            </div>
          </div>

          <div className="share-actions-list">
            <button
              className="stark-button"
              style={{ background: '#FFFC00', color: '#000', border: '2.5px solid #000', boxShadow: '3px 3px 0px #000' }}
              onClick={handleNativeShare}
              disabled={isGenerating}
            >
              👻 SHARE DIRECTLY TO SNAPCHAT / APPS
            </button>

            <button
              className="stark-button secondary"
              onClick={handleDownloadImage}
              disabled={isGenerating}
            >
              ⬇️ DOWNLOAD STORY / SNAP IMAGE (PNG)
            </button>
          </div>
        </div>

        <div className="share-guide-tip">
          💡 <strong>How to post on Snapchat:</strong>
          <ul style={{ margin: '0.4rem 0 0 1.2rem', textAlign: 'left', lineHeight: '1.4' }}>
            <li>On mobile: Tap <strong>Share directly</strong> and select <strong>Snapchat</strong> or <strong>WhatsApp</strong> to attach image + link!</li>
            <li>Or tap <strong>Download Story Snap Image</strong>, open Snapchat, swipe up to Camera Roll, and post it to your Snap Story!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
