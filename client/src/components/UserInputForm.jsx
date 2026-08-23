import React, { useState } from 'react';

export default function UserInputForm({ onSubmit, isLoading }) {
  const [age, setAge] = useState('24');
  const [gender, setGender] = useState('Female');
  const [desperation, setDesperation] = useState(75);

  const getDesperationBadge = (val) => {
    if (val <= 30) return { label: 'LOW DESPERATION 🥱', color: '#FFFC00' };
    if (val <= 65) return { label: 'MEDIUM DESPERATION 😬', color: '#00E5FF' };
    if (val <= 85) return { label: 'HIGH DESPERATION 🆘', color: '#FF52A2' };
    return { label: 'MAX DESPERATION 🔥', color: '#A060FF' };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ age, gender, desperation });
  };

  const badge = getDesperationBadge(desperation);

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '60vh' }}>
      <div className="stark-card" style={{ maxWidth: '640px', width: '100%', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem', borderBottom: '2.5px solid var(--border-color)', paddingBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '900' }}>
          01 // ENTER YOUR DETAILS
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontWeight: '600' }}>
          Input your parameters & desperation level to calculate your relationship match.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="user-age">Your Age</label>
            <input
              id="user-age"
              type="number"
              min="18"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="stark-input"
              required
              placeholder="e.g. 24"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="user-gender">Your Gender</label>
            <select
              id="user-gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="stark-select"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1', marginTop: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="form-label" htmlFor="user-desperation" style={{ margin: 0 }}>
                🎚️ DESPERATION METER
              </label>
              <span
                className="mono-tag-badge"
                style={{
                  background: badge.color,
                  color: desperation > 85 ? '#FFF' : '#000',
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.5rem',
                  border: '1.5px solid #000',
                  boxShadow: '2px 2px 0px #000'
                }}
              >
                {badge.label} ({desperation}%)
              </span>
            </div>
            <input
              id="user-desperation"
              type="range"
              min="1"
              max="100"
              value={desperation}
              onChange={(e) => setDesperation(Number(e.target.value))}
              className="desperation-slider"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: '800', color: '#555', marginTop: '0.35rem' }}>
              <span>🥱 CHILL (LOW)</span>
              <span>😬 DESPERATE</span>
              <span>🔥 UNHINGED (MAX)</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <button
            type="submit"
            className="stark-button"
            style={{ width: '100%', maxWidth: '280px', justifyContent: 'center' }}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'See Results →'}
          </button>
        </div>
      </form>
      <p style={{
        marginTop: '1.5rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        fontFamily: 'var(--font-mono)',
        fontWeight: '500',
        letterSpacing: '0.02em'
      }}>
        Hope you find your perfect match...
      </p>
    </div>
  </div>
);
}
