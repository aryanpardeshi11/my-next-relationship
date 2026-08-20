import React, { useState } from 'react';

export default function UserInputForm({ onSubmit, isLoading }) {
  const [age, setAge] = useState('24');
  const [gender, setGender] = useState('Female');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ age, gender });
  };

  return (
    <div className="stark-card" style={{ maxWidth: '640px', margin: '2rem auto 0 auto' }}>
      <div style={{ marginBottom: '1.5rem', borderBottom: '2.5px solid var(--border-color)', paddingBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '900' }}>
          01 // ENTER YOUR DETAILS
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontWeight: '600' }}>
          Input your parameters to calculate your statistically improbable relationship match.
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
    </div>
  );
}
