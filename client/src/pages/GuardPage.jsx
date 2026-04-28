import React, { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { parkingService } from '../services/parkingService';
import { extractErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { N } from '../styles/theme';

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
  const { user } = useAuth();
  const [passes, setPasses] = useState([]);
  const [token, setToken] = useState('');
  const [scanType, setScanType] = useState('entry');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [scanInfo, setScanInfo] = useState('');
  const [toast, setToast] = useState(null);
  const canVerify = user?.role === 'guard' || user?.role === 'admin';

  const showToast = (type, message) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 2600);
  };

  const playSuccessCue = () => {
    try {
      if (navigator?.vibrate) {
        navigator.vibrate([80, 40, 80]);
      }
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const now = ctx.currentTime;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(720, now);
      oscillator.frequency.linearRampToValueAtTime(980, now + 0.12);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.24);
    } catch {
      // best-effort feedback only
    }
  };

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
    if (!canVerify) {
      const message = `Only guard/admin can verify QR passes. Current role: ${user?.role || 'unknown'}.`;
      setError(message);
      showToast('error', message);
      return;
    }
    const normalized = String(value || '').trim();
    if (!normalized) {
      const message = 'Scan token is required.';
      setError(message);
      showToast('error', message);
      return;
    }
    try {
      const response = await parkingService.verifyPass({ token: normalized, scanType });
      setResult(response);
      showToast('success', response?.message || 'QR verified successfully.');
      playSuccessCue();
      await load();
    } catch (err) {
      const message = extractErrorMessage(err);
      if (String(message).toLowerCase().includes('do not have access')) {
        const noAccess = `Only guard/admin can verify QR passes. Current role: ${user?.role || 'unknown'}.`;
        setError(noAccess);
        showToast('error', noAccess);
      } else {
        setError(message);
        showToast('error', message);
      }
      setResult(null);
    }
  };

  const decodeQrFromImageFile = async (file) => {
    if (!file) return;
    setError('');
    setScanInfo('');

    try {
      let scannedToken = '';

      if ('BarcodeDetector' in window) {
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
        const bitmap = await createImageBitmap(file);
        const results = await detector.detect(bitmap);
        bitmap.close();
        scannedToken = String(results?.[0]?.rawValue || '').trim();
      }

      if (!scannedToken) {
        const jsQRModule = await import('jsqr');
        const jsQR = jsQRModule.default || jsQRModule;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d', { willReadFrequently: true });

        const attemptDecode = (width, height, drawFn) => {
          canvas.width = width;
          canvas.height = height;
          drawFn();
          const imageData = context.getImageData(0, 0, width, height);

          const direct = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth',
          });
          if (direct?.data) return direct.data;

          const thresholdLevels = [110, 140, 170, 200];
          for (const threshold of thresholdLevels) {
            const mono = new Uint8ClampedArray(imageData.data);
            for (let i = 0; i < mono.length; i += 4) {
              const lum = 0.299 * mono[i] + 0.587 * mono[i + 1] + 0.114 * mono[i + 2];
              const value = lum > threshold ? 255 : 0;
              mono[i] = value;
              mono[i + 1] = value;
              mono[i + 2] = value;
            }
            const decoded = jsQR(mono, imageData.width, imageData.height, {
              inversionAttempts: 'attemptBoth',
            });
            if (decoded?.data) return decoded.data;
          }

          return '';
        };

        const originalBitmap = await createImageBitmap(file);
        const scaleFactors = [1, 1.5, 2, 3];
        for (const scale of scaleFactors) {
          const width = Math.max(1, Math.round(originalBitmap.width * scale));
          const height = Math.max(1, Math.round(originalBitmap.height * scale));
          const decoded = attemptDecode(width, height, () => {
            context.drawImage(originalBitmap, 0, 0, width, height);
          });
          if (decoded) {
            scannedToken = decoded;
            break;
          }
        }
        originalBitmap.close();

        scannedToken = String(scannedToken || '').trim();
      }

      if (!scannedToken) {
        const message = 'No QR code detected. Upload the direct QR image from Parking page (not a cropped/blur screenshot).';
        setError(message);
        showToast('error', message);
        return;
      }

      setToken(scannedToken);
      setScanInfo('QR detected successfully. Verifying now...');
      showToast('success', 'QR detected. Running verification...');
      await verify(scannedToken);
    } catch (_error) {
      const message = 'Unable to scan this QR image. Try a clearer image or paste the token manually.';
      setError(message);
      showToast('error', message);
    }
  };

  return (
    <AppShell
      title="Guard Scanner"
      subtitle="Use the QR token to approve gate entry, prevent pass re-use, and release the guest slot once a visitor leaves."
    >
      {error ? <div style={{ color: '#d64545', marginBottom: '16px' }}>{error}</div> : null}
      {toast ? (
        <div
          style={{
            position: 'fixed',
            right: '22px',
            top: '20px',
            zIndex: 1200,
            padding: '12px 16px',
            borderRadius: '14px',
            background: toast.type === 'success' ? '#edf7f4' : '#fff2eb',
            color: toast.type === 'success' ? N.tealDark : '#b85c38',
            fontWeight: 800,
            boxShadow: '10px 10px 20px rgba(184,190,199,0.75), -8px -8px 18px rgba(255,255,255,0.8)',
          }}
        >
          {toast.message}
        </div>
      ) : null}
      {!canVerify ? (
        <div style={{ color: '#b85c38', marginBottom: '16px', fontWeight: 700 }}>
          You are signed in as <strong>{user?.role || 'unknown'}</strong>. Sign in with a <strong>guard</strong> or <strong>admin</strong> account to verify QR passes.
        </div>
      ) : null}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '18px' }}>
        <div style={{ padding: '22px', borderRadius: '24px', background: N.bg, boxShadow: '8px 8px 16px #b8bec7, -8px -8px 16px #ffffff' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '18px' }}>Scan or Paste Token</h2>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(event) => decodeQrFromImageFile(event.target.files?.[0])}
            style={{
              width: '100%',
              marginBottom: '12px',
              borderRadius: '14px',
              padding: '10px 12px',
              background: 'rgba(255,255,255,0.65)',
            }}
          />
          {scanInfo ? <div style={{ color: N.tealDark, marginBottom: '10px', fontWeight: 700 }}>{scanInfo}</div> : null}
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





