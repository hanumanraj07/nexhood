import React, { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { parkingService } from '../services/parkingService';
import { extractErrorMessage } from '../services/api';
import { N } from '../styles/neumorphism';

const modeButtonStyle = {
  flex: 1,
  padding: '12px 16px',
  borderRadius: '16px',
  boxShadow: '8px 8px 16px #b8bec7, -8px -8px 16px #ffffff',
  fontWeight: 800,
};

const primaryButtonStyle = {
  width: '100%',
  padding: '14px 18px',
  borderRadius: '16px',
  background: N.teal,
  color: '#fff',
  fontWeight: 800,
};

const GuardPage = () => {
  const [passes, setPasses] = useState([]);
  const [token, setToken] = useState('');
  const [scanType, setScanType] = useState('entry');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await parkingService.getPasses();
      setPasses(data.filter((pass) => pass.status === 'active').slice(0, 6));
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const verify = async (value = token) => {
    setError('');
    try {
      const response = await parkingService.verifyPass({ token: value, scanType });
      setResult(response);
      await load();
    } catch (err) {
      setError(extractErrorMessage(err));
      setResult(null);
    }
  };

  return (
    <AppShell
      title="Guard Scanner"
      subtitle="Use the QR token to approve gate entry, prevent pass re-use, and release the guest slot once a visitor leaves."
    >
      {error ? <div style={{ color: '#d64545', marginBottom: '16px' }}>{error}</div> : null}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '18px' }}>
        <div style={{ padding: '22px', borderRadius: '24px', background: N.bg, boxShadow: '8px 8px 16px #b8bec7, -8px -8px 16px #ffffff' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '18px' }}>Scan or Paste Token</h2>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste the QR token here, or use one of the active passes on the right."
            style={{
              width: '100%',
              minHeight: '180px',
              borderRadius: '18px',
              padding: '16px',
              background: N.bg,
              boxShadow: 'inset 4px 4px 10px #b8bec7, inset -4px -4px 10px #ffffff',
              resize: 'vertical',
            }}
          />
          <div style={{ display: 'flex', gap: '12px', marginTop: '14px' }}>
            <button type="button" onClick={() => setScanType('entry')} style={{ ...modeButtonStyle, background: scanType === 'entry' ? '#edf7f4' : N.bg }}>
              Entry
            </button>
            <button type="button" onClick={() => setScanType('exit')} style={{ ...modeButtonStyle, background: scanType === 'exit' ? '#fff2eb' : N.bg }}>
              Exit
            </button>
          </div>
          <button type="button" onClick={() => verify()} style={{ ...primaryButtonStyle, marginTop: '16px' }}>
            Verify Pass
          </button>
        </div>

        <div style={{ padding: '22px', borderRadius: '24px', background: N.bg, boxShadow: '8px 8px 16px #b8bec7, -8px -8px 16px #ffffff' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '18px' }}>Quick Verify</h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {passes.map((pass) => (
              <button
                key={pass.id}
                type="button"
                onClick={() => {
                  setToken(pass.qrPayload);
                  verify(pass.qrPayload);
                }}
                style={{
                  padding: '16px',
                  borderRadius: '18px',
                  textAlign: 'left',
                  background: N.bg,
                  boxShadow: 'inset 4px 4px 10px #b8bec7, inset -4px -4px 10px #ffffff',
                }}
              >
                <div style={{ fontWeight: 900 }}>{pass.visitorName}</div>
                <div style={{ marginTop: '4px', color: N.textLight }}>{pass.vehicleNumber} • {pass.slotAssigned}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {result ? (
        <div style={{ marginTop: '22px', padding: '22px', borderRadius: '24px', background: result.duplicate ? '#fff2eb' : '#edf7f4' }}>
          <div style={{ fontSize: '24px', fontWeight: 900, color: result.duplicate ? '#b85c38' : N.tealDark }}>{result.message}</div>
          {result.pass ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginTop: '16px' }}>
              <div><strong>Visitor:</strong> {result.pass.visitorName}</div>
              <div><strong>Vehicle:</strong> {result.pass.vehicleNumber}</div>
              <div><strong>Host:</strong> {result.pass.hostApartment}</div>
              <div><strong>Slot:</strong> {result.pass.slotAssigned}</div>
            </div>
          ) : null}
        </div>
      ) : null}
    </AppShell>
  );
};

export default GuardPage;
