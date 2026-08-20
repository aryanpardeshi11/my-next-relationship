import React, { useState } from 'react';

export default function UserInputForm({ onSubmit, isLoading }) {
  const [age, setAge] = useState('24');
  const [gender, setGender] = useState('Non-binary');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ age, gender });
  };

  return (
    <div className="stark-card">
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          01 // Enter Subject Metadata
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
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
            <label className="form-label" htmlFor="user-gender">Your Gender Identity</label>
            <select
              id="user-gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="stark-select"
            >
              <option value="Agender">Agender</option>
              <option value="Cisgender Female">Cisgender Female</option>
              <option value="Cisgender Male">Cisgender Male</option>
              <option value="Genderfluid">Genderfluid</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Transgender Female">Transgender Female</option>
              <option value="Transgender Male">Transgender Male</option>
              <option value="Two-Spirit">Two-Spirit</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            className="stark-button"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Calculate Red Flags →'}
          </button>
        </div>
      </form>
    </div>
  );
}
