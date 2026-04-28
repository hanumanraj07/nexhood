import React, { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { parkingService } from '../services/parkingService';
import { extractErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { N } from '../styles/theme';

const initialForm = {
  visitorName: '',
  vehicleNumber: '',
  arrivalWindowStart: '',
  durationHours: 2,
  hostApartment: '',
};

const inputStyle = {
  width: '100%',
  borderRadius: '16px',
  background: N.bg,
  boxShadow: 'inset 4px 4px 10px #b8bec7, inset -4px -4px 10px #ffffff',
  padding: '14px 16px',
  color: N.text,
};

const primaryButtonStyle = {
  marginTop: '18px',
  padding: '14px 18px',
  borderRadius: '16px',
  background: N.teal,
  color: '#fff',
  fontWeight: 800,
  width: '100%',
};

const ParkingPage = () => {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [passes, setPasses] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 2600);
  };

  const load = async () => {
    try {
      const [slotData, passData] = await Promise.all([parkingService.getSlots(), parkingService.getPasses()]);
      setSlots(slotData.slots);
      setPasses(passData);
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createPass = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const created = await parkingService.createPass({
        ...form,
        hostApartment: form.hostApartment || user?.apartment,
      });
      setSuccess(`Pass created for ${created.visitorName} in slot ${created.slotAssigned}.`);
      showToast('success', `Pass generated for ${created.visitorName}`);
      setForm(initialForm);
      await load();
    } catch (err) {
      const message = extractErrorMessage(err);
      setError(message);
      showToast('error', message);
    } finally {
      setSubmitting(false);
    }
  };

  const downloadQr = (pass) => {
    if (!pass?.qrCode) return;
    const link = document.createElement('a');
    link.href = pass.qrCode;
    link.download = `nexhood-qr-${pass.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'QR downloaded');
  };

  const canCreate = user?.role === 'resident' || user?.role === 'admin';

  return (
    <AppShell
      title={user?.role === 'admin' ? 'Society Parking' : 'Visitor Parking'}
      subtitle="Generate time-bound visitor passes, track slot occupancy, and keep the guest parking flow accountable."
    >
      {error ? <div style={{ color: '#d64545', marginBottom: '14px' }}>{error}</div> : null}
      {success ? <div style={{ color: N.tealDark, marginBottom: '14px' }}>{success}</div> : null}
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

      <div style={{ display: 'grid', gridTemplateColumns: canCreate ? '1.15fr 1fr' : '1fr', gap: '18px' }}>
        {canCreate ? (
          <form onSubmit={createPass} style={{ padding: '22px', borderRadius: '24px', background: N.bg, boxShadow: '8px 8px 16px #b8bec7, -8px -8px 16px #ffffff' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '18px' }}>Generate Visitor Pass</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' }}>
              <input value={form.visitorName} onChange={(e) => setForm({ ...form, visitorName: e.target.value })} placeholder="Visitor name" style={inputStyle} required />
              <input value={form.vehicleNumber} onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })} placeholder="Vehicle number" style={inputStyle} required />
              <input type="datetime-local" value={form.arrivalWindowStart} onChange={(e) => setForm({ ...form, arrivalWindowStart: e.target.value })} style={inputStyle} required />
              <select value={form.durationHours} onChange={(e) => setForm({ ...form, durationHours: Number(e.target.value) })} style={inputStyle}>
                <option value={2}>2 hours</option>
                <option value={4}>4 hours</option>
                <option value={8}>Full day</option>
              </select>
              <input value={form.hostApartment} onChange={(e) => setForm({ ...form, hostApartment: e.target.value })} placeholder={`Host apartment (${user?.apartment || 'optional'})`} style={{ ...inputStyle, gridColumn: '1 / -1' }} />
            </div>
            <button type="submit" disabled={submitting} style={primaryButtonStyle}>
              {submitting ? 'Creating...' : 'Generate Pass'}
            </button>
          </form>
        ) : null}

        <div style={{ padding: '22px', borderRadius: '24px', background: N.bg, boxShadow: '8px 8px 16px #b8bec7, -8px -8px 16px #ffffff' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '18px' }}>Guest Slot Map</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
            {slots.map((slot) => (
              <div
                key={slot.slotId}
                style={{
                  padding: '14px',
                  borderRadius: '18px',
                  textAlign: 'center',
                  background: slot.status === 'available' ? '#edf7f4' : '#fff2eb',
                  color: slot.status === 'available' ? N.tealDark : '#b85c38',
                }}
              >
                <div style={{ fontWeight: 900 }}>{slot.slotId}</div>
                <div style={{ marginTop: '6px', fontSize: '13px', fontWeight: 700 }}>{slot.status}</div>
                {slot.visitorName ? <div style={{ marginTop: '6px', fontSize: '12px' }}>{slot.visitorName}</div> : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '18px', marginTop: '22px' }}>
        {passes.map((pass) => (
          <div key={pass.id} style={{ padding: '22px', borderRadius: '24px', background: N.bg, boxShadow: '8px 8px 16px #b8bec7, -8px -8px 16px #ffffff', display: 'grid', gridTemplateColumns: '1fr 180px', gap: '18px', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: 900 }}>{pass.visitorName}</h3>
                  <p style={{ marginTop: '4px', color: N.textLight }}>{pass.vehicleNumber} • Slot {pass.slotAssigned} • Host {pass.hostApartment}</p>
                </div>
                <div style={{ fontWeight: 800, color: pass.status === 'active' ? N.tealDark : '#b85c38' }}>{pass.status}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '14px' }}>
                <div><strong>Start:</strong> {new Date(pass.arrivalWindowStart).toLocaleString()}</div>
                <div><strong>Valid until:</strong> {new Date(pass.validUntil).toLocaleString()}</div>
                <div><strong>Duration:</strong> {pass.durationHours} hours</div>
                <div><strong>Scans:</strong> {pass.auditLogs.length}</div>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              {pass.qrCode ? (
                <>
                  <div
                    style={{
                      width: '176px',
                      height: '176px',
                      margin: '0 auto',
                      background: '#ffffff',
                      borderRadius: '0',
                      padding: '8px',
                      boxShadow: 'inset 2px 2px 5px rgba(38,70,83,0.14), inset -2px -2px 5px rgba(255,255,255,0.8)',
                    }}
                  >
                    <img
                      src={pass.qrCode}
                      alt={`QR for ${pass.visitorName}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        borderRadius: '0',
                        imageRendering: 'pixelated',
                        display: 'block',
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadQr(pass)}
                    style={{
                      marginTop: '10px',
                      width: '176px',
                      padding: '9px 12px',
                      borderRadius: '12px',
                      background: '#edf7f4',
                      color: N.tealDark,
                      fontWeight: 800,
                    }}
                  >
                    Download QR
                  </button>
                </>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
};

export default ParkingPage;





