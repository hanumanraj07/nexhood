import React, { useEffect, useState } from 'react';
import { neighborhoodService } from '../services/neighborhoodService';
import { authService } from '../services/authService';
import { extractErrorMessage } from '../services/api';
import { N } from '../styles/theme';

const ResidentLocationPrompt = ({ onSaved }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const value = query.trim();
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const rows = await neighborhoodService.suggestLocations(value);
        if (!cancelled) setSuggestions(rows);
      } catch {
        if (!cancelled) setSuggestions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const saveLocation = async () => {
    if (!selected) {
      setError('Select a location from suggestions first.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const { user } = await authService.updateLocation({
        displayName: selected.displayName,
        latitude: selected.latitude,
        longitude: selected.longitude,
      });
      onSaved(user);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: N.bg,
        padding: '20px',
      }}
    >
      <div
        style={{
          width: 'min(720px, 100%)',
          borderRadius: '24px',
          padding: '24px',
          background: N.bg,
          boxShadow: '12px 12px 24px rgba(184,190,199,0.92), -10px -10px 22px rgba(255,255,255,0.88)',
        }}
      >
        <h2 style={{ fontSize: '30px', fontWeight: 900, color: N.teal }}>Set Your Home Location</h2>
        <p style={{ marginTop: '10px', color: N.textLight, lineHeight: 1.6 }}>
          We personalize neighborhood insights and dashboard data based on your selected location.
        </p>

        <input
          value={query}
          onChange={(event) => {
            setSelected(null);
            setQuery(event.target.value);
          }}
          placeholder="Search locality, city or landmark"
          style={{
            width: '100%',
            marginTop: '16px',
            minHeight: '48px',
            borderRadius: '14px',
            padding: '0 14px',
            background: 'rgba(255,255,255,0.65)',
            boxShadow: 'inset 4px 4px 10px #b8bec7, inset -4px -4px 10px #ffffff',
          }}
        />

        <div style={{ marginTop: '12px', display: 'grid', gap: '10px', maxHeight: '260px', overflowY: 'auto' }}>
          {loading ? <div style={{ color: N.textLight, fontWeight: 700 }}>Finding locations...</div> : null}
          {suggestions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSelected(item);
                setQuery(item.displayName);
                setSuggestions([]);
              }}
              style={{
                padding: '12px 14px',
                borderRadius: '14px',
                textAlign: 'left',
                background: selected?.id === item.id ? '#edf7f4' : 'rgba(255,255,255,0.5)',
                color: selected?.id === item.id ? N.tealDark : N.text,
                fontWeight: 700,
              }}
            >
              {item.displayName}
            </button>
          ))}
        </div>

        {selected ? (
          <div style={{ marginTop: '14px', color: N.tealDark, fontWeight: 700 }}>
            Selected: {selected.displayName}
          </div>
        ) : null}
        {error ? <div style={{ marginTop: '10px', color: '#d64545', fontWeight: 700 }}>{error}</div> : null}

        <button
          type="button"
          onClick={saveLocation}
          disabled={saving}
          style={{
            marginTop: '18px',
            width: '100%',
            minHeight: '48px',
            borderRadius: '14px',
            background: N.teal,
            color: '#fff',
            fontWeight: 800,
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? 'Saving location...' : 'Save and Continue'}
        </button>
      </div>
    </div>
  );
};

export default ResidentLocationPrompt;





