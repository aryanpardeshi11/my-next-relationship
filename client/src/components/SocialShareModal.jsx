import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

export default function SocialShareModal({ matchData, userInput, matchDescription, onClose }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const snapCardRef = useRef(null);

  const displayHost = (typeof window !== 'undefined' && window.location.host && !window.location.host.includes('localhost'))
    ? window.location.host
    : 'my-next-relationship.onrender.com';

  const getShareText = () => {
    let text = `🔥 MY NEXT RELATIONSHIP MATCH 🔥\n`;
    if (userInput && (userInput.age || userInput.gender)) {
      text += `🎯 SEEKER: ${userInput.age} y/o ${userInput.gender}\n`;
    }
    text += `💖 PREDICTED MATCH:\n`;
    text += `👤 Age: ${matchData.age} | ${matchData.gender}\n`;
    text += `📏 Height: ${matchData.height}\n`;
    text += `💼 Job: ${matchData.job}\n`;
    text += `🎭 Trait: ${matchData.personality || matchData.trait}\n`;
    text += `🎨 Hobby: ${matchData.hobby}\n`;
    text += `🚩 Flag: ${matchData.greenFlag || matchData.redFlag}\n`;
    if (matchDescription) {
      text += `\n🔮 Sarcastic Vibe: "${matchDescription}"\n`;
    }
    const shareUrl = window.location.origin.includes('localhost') ? 'https://my-next-relationship.onrender.com' : window.location.origin;
    text += `\nFind your match at: ${shareUrl}`;
    return text;
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(getShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const generateCanvasImage = async () => {
    if (!snapCardRef.current) return null;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(snapCardRef.current, {
        scale: 2,
        backgroundColor: '#FFE600',
        useCORS: true,
        logging: false
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

    if (canvas && navigator.share) {
      try {
        canvas.toBlob(async (blob) => {
          if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], 'match-snap.png', { type: 'image/png' })] })) {
            const file = new File([blob], 'match-snap.png', { type: 'image/png' });
            await navigator.share({
              title: 'My Next Relationship',
              files: [file]
            });
          } else {
            await navigator.share({
              title: 'My Next Relationship',
              url: window.location.href
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

        {/* Hidden Snap Story Card (Formatted as 9:16 Vertical Story Image for Snapchat) */}
        <div style={{ overflow: 'hidden', height: 0, position: 'absolute', top: '-9999px', left: '-9999px' }}>
          <div ref={snapCardRef} className="snap-story-card">
            <div className="snap-card-badge">DYNAMIC MATCHMAKING ENGINE // VER 1.0</div>
            <h2 className="snap-card-title">MY NEXT RELATIONSHIP</h2>

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
              🔗 TRY YOUR MATCH AT: <strong>{displayHost}</strong>
            </div>
          </div>
        </div>

        {/* Visual Preview & Share Actions */}
        <div className="snap-preview-container">
          <div className="snap-preview-box">
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: '800', marginBottom: '0.5rem', color: '#555' }}>
              📱 SNAPCHAT STORY PREVIEW (9:16 CARD)
            </div>
            <div className="mini-snap-card">
              <div style={{ fontWeight: '900', fontSize: '1rem', color: '#000', marginBottom: '0.4rem' }}>MY NEXT RELATIONSHIP</div>
              {userInput && (userInput.age || userInput.gender) && (
                <div style={{ background: '#FFFC00', border: '1.5px solid #000', padding: '0.25rem 0.4rem', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.4rem', color: '#000' }}>
                  🎯 <strong>YOU:</strong> {userInput.age} y/o {userInput.gender} ➔ 💖 <strong>MATCH:</strong> {matchData.age} y/o {matchData.gender}
                </div>
              )}
              <div style={{ fontSize: '0.82rem', lineHeight: '1.4', fontWeight: '700' }}>
                👤 {matchData.age} y/o {matchData.gender} ({matchData.height})<br />
                💼 {matchData.job}<br />
                🎭 {matchData.personality || matchData.trait}<br />
                🎨 {matchData.hobby}
              </div>
              {matchDescription && (
                <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#FFFDF0', border: '1.5px solid #000', fontSize: '0.78rem', fontStyle: 'italic', color: '#111' }}>
                  "{matchDescription}"
                </div>
              )}
              <div style={{ marginTop: '0.5rem', background: '#FFFFFF', border: '1.5px solid #000', padding: '0.35rem 0.5rem', fontSize: '0.72rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#000', textAlign: 'center' }}>
                🔗 TRY IT AT: {displayHost}
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
              ⬇️ DOWNLOAD STORY SNAP IMAGE (PNG)
            </button>

            <button
              className="stark-button"
              style={{ background: '#FFFFFF', color: '#000' }}
              onClick={handleCopyText}
            >
              {copied ? '✓ COPIED SNAP TEXT!' : '📋 COPY SNAP TEXT'}
            </button>
          </div>
        </div>

        <div className="share-guide-tip">
          💡 <strong>How to post on Snapchat:</strong>
          <ul style={{ margin: '0.4rem 0 0 1.2rem', textAlign: 'left', lineHeight: '1.4' }}>
            <li>On mobile: Tap <strong>Share directly</strong> and select <strong>Snapchat</strong> from your share sheet!</li>
            <li>Or tap <strong>Download Story Snap Image</strong>, open Snapchat, swipe up to Camera Roll, and post it to your Snap Story!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
