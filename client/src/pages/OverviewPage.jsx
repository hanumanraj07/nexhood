import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, MapPin, ShieldCheck } from 'lucide-react';
import AppShell from '../components/AppShell';
import StatCard from '../components/StatCard';
import { api, extractErrorMessage } from '../services/api';
import { parkingService } from '../services/parkingService';
import { useAuth } from '../context/AuthContext';
import { N } from '../styles/theme';

const iconStyle = { width: 18, height: 18, color: N.teal };

const OverviewPage = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [passes, setPasses] = useState([]);
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data }, passList, slotData] = await Promise.all([
          api.get('/dashboard/overview'),
          parkingService.getPasses(),
          parkingService.getSlots(),
        ]);
        setOverview(data.overview);
        setPasses(passList.slice(0, 4));
        setSlots(slotData.slots.slice(0, 6));
      } catch (err) {
        setError(extractErrorMessage(err));
      }
    };

    load();
  }, []);

  return (
    <AppShell
      title={user?.role === 'admin' ? 'Admin Overview' : user?.role === 'guard' ? 'Gate Control' : 'Resident Overview'}
      subtitle="A live snapshot of neighborhood intelligence, visitor movement, and society parking capacity."
    >
      {error ? <div style={{ color: '#d64545', marginBottom: '18px' }}>{error}</div> : null}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '18px' }}
      >
        <StatCard label="NexScore" value={overview ? `${overview.neighborhoodScore}/100` : '--'} hint="Featured locality score" />
        <StatCard label="Active Passes" value={overview?.activePasses ?? '--'} hint="Visitor passes still valid right now" tone="success" />
        <StatCard label="Guest Slots Used" value={overview ? `${overview.occupiedGuestSlots}/${overview.totalGuestSlots}` : '--'} hint="Society occupancy snapshot" tone="warning" />
        <StatCard label="Tracked Areas" value={overview?.trackedNeighborhoods ?? '--'} hint="Neighborhoods available for side-by-side comparison" />
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '18px', marginTop: '22px' }}>
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="dashboard-panel"
          style={{
            borderRadius: '24px',
            padding: '24px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.52), rgba(224,229,236,1))',
            boxShadow: '12px 12px 24px rgba(184,190,199,0.9), -8px -8px 18px rgba(255,255,255,0.86)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <MapPin style={iconStyle} />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: N.tealDeep }}>Featured Neighborhood</h2>
          </div>
          <h3 style={{ fontSize: '26px', fontWeight: 900 }}>{overview?.featuredNeighborhood?.name || 'Loading...'}</h3>
          <p style={{ marginTop: '10px', color: N.textLight, lineHeight: 1.6 }}>{overview?.featuredNeighborhood?.summary}</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '16px' }}>
            {(overview?.featuredNeighborhood?.tags || []).map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '8px 12px',
                  borderRadius: '999px',
                  boxShadow: 'inset 4px 4px 10px #b8bec7, inset -4px -4px 10px #ffffff',
                  color: N.tealDeep,
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginTop: '18px' }}>
            <StatCard label="Education" value={overview?.featuredNeighborhood?.subScores?.education ?? '--'} />
            <StatCard label="Safety" value={overview?.featuredNeighborhood?.subScores?.safety ?? '--'} />
            <StatCard label="Infra" value={overview?.featuredNeighborhood?.subScores?.infrastructure ?? '--'} />
          </div>
        </motion.div>

        <div style={{ display: 'grid', gap: '18px' }}>
          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.14 }}
            className="dashboard-panel"
            style={{
              borderRadius: '24px',
              padding: '22px',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.5), rgba(224,229,236,1))',
              boxShadow: '12px 12px 24px rgba(184,190,199,0.9), -8px -8px 18px rgba(255,255,255,0.86)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <BarChart3 style={iconStyle} />
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Recent Passes</h2>
            </div>
            <div style={{ display: 'grid', gap: '12px' }}>
              {passes.map((pass) => (
                <div key={pass.id} style={{ padding: '14px', borderRadius: '18px', boxShadow: 'inset 4px 4px 10px #b8bec7, inset -4px -4px 10px #ffffff' }}>
                  <div style={{ fontWeight: 800 }}>{pass.visitorName}</div>
                  <div style={{ color: N.textLight, fontSize: '14px', marginTop: '4px' }}>{pass.vehicleNumber} • {pass.slotAssigned}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="dashboard-panel"
            style={{
              borderRadius: '24px',
              padding: '22px',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.5), rgba(224,229,236,1))',
              boxShadow: '12px 12px 24px rgba(184,190,199,0.9), -8px -8px 18px rgba(255,255,255,0.86)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <ShieldCheck style={iconStyle} />
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Slot Snapshot</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px' }}>
              {slots.map((slot) => (
                <div
                  key={slot.slotId}
                  style={{
                    padding: '12px',
                    borderRadius: '16px',
                    textAlign: 'center',
                    background: slot.status === 'available' ? '#edf7f4' : '#fff2eb',
                    color: slot.status === 'available' ? N.tealDark : '#b85c38',
                    fontWeight: 800,
                  }}
                >
                  <div>{slot.slotId}</div>
                  <div style={{ marginTop: '4px', fontSize: '12px' }}>{slot.status}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.24 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginTop: '22px' }}
      >
        <StatCard label="Role" value={user?.role || '--'} hint="Access level currently active" />
        <StatCard label="Apartment" value={user?.apartment || '--'} hint="Resident or staff location mapping" />
        <StatCard label="Society Incidents" value={overview?.incidents ?? '--'} hint="Open issue count tracked by admin" tone="danger" />
        <StatCard label="Live Tools" value={user?.role === 'guard' ? 'Scanner + Slots' : user?.role === 'admin' ? 'Admin + Parking' : 'Neighborhood + Parking'} hint="Role-tailored workflow modules" />
      </motion.div>
    </AppShell>
  );
};

export default OverviewPage;





