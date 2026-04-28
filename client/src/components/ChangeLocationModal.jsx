import React, { useEffect, useState } from 'react';
import { neighborhoodService } from '../services/neighborhoodService';
import { authService } from '../services/authService';
import { extractErrorMessage } from '../services/api';
import { N } from '../styles/theme';

const ChangeLocationModal = ({ initialLocation, onClose, onSaved }) => {
  const [query, setQuery] = useState(initialLocation?.displayName || '');
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

  const save = async () => {
    if (!selected) {
      setError('Select a location from suggestions.');
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
        position: 'fixed',
        inset: 0,
        zIndex: 1400,
        background: 'rgba(23,36,50,0.35)',
        display: 'grid',
        placeItems: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: 'min(620px, 100%)',
          borderRadius: '22px',
          background: N.bg,
          padding: '20px',
          boxShadow: '16px 16px 26px rgba(184,190,199,0.95), -12px -12px 22px rgba(255,255,255,0.88)',
        }}
      >
        <h3 style={{ fontSize: '24px', fontWeight: 900, color: N.teal }}>Change Location</h3>
        <p style={{ marginTop: '8px', color: N.textLight }}>
          Select your locality to personalize dashboard insights.
        </p>
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelected(null);
          }}
          placeholder="Search area, city or landmark"
          style={{
            width: '100%',
            marginTop: '12px',
            minHeight: '46px',
            borderRadius: '12px',
            padding: '0 12px',
            background: 'rgba(255,255,255,0.66)',
            boxShadow: 'inset 4px 4px 10px #b8bec7, inset -4px -4px 10px #ffffff',
          }}
        />
        <div style={{ marginTop: '10px', display: 'grid', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
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
                padding: '10px 12px',
                borderRadius: '12px',
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
        {error ? <div style={{ marginTop: '10px', color: '#d64545', fontWeight: 700 }}>{error}</div> : null}
        <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              minHeight: '44px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.55)',
              color: N.text,
              fontWeight: 800,
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            style={{
              flex: 1,
              minHeight: '44px',
              borderRadius: '12px',
              background: N.teal,
              color: '#fff',
              fontWeight: 800,
              opacity: saving ? 0.75 : 1,
            }}
          >
            {saving ? 'Saving...' : 'Save Location'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeLocationModal;





