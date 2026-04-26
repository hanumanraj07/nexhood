import React, { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import StatCard from '../components/StatCard';
import { adminService } from '../services/adminService';
import { extractErrorMessage } from '../services/api';
import { N } from '../styles/neumorphism';

const ResidentsPage = () => {
  const [data, setData] = useState({ residents: [], incidents: [] });
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [residentData, overviewStats] = await Promise.all([adminService.getResidents(), adminService.getOverview()]);
        setData(residentData);
        setStats(overviewStats);
      } catch (err) {
        setError(extractErrorMessage(err));
      }
    };

    load();
  }, []);

  return (
    <AppShell
      title="Resident Admin"
      subtitle="Track occupancy, manage resident records, and keep an eye on parking-related incidents across the society."
    >
      {error ? <div style={{ color: '#d64545', marginBottom: '18px' }}>{error}</div> : null}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        <StatCard label="Residents" value={stats?.totalResidents ?? '--'} />
        <StatCard label="Active Passes" value={stats?.activePasses ?? '--'} tone="success" />
        <StatCard label="Occupied Slots" value={stats?.occupiedSlots ?? '--'} tone="warning" />
        <StatCard label="Incident Reports" value={stats?.totalIncidents ?? '--'} tone="danger" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '18px', marginTop: '22px' }}>
        <div style={{ padding: '22px', borderRadius: '24px', background: N.bg, boxShadow: '8px 8px 16px #b8bec7, -8px -8px 16px #ffffff' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '18px' }}>Residents</h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {data.residents.map((resident) => (
              <div key={resident.id} style={{ padding: '16px', borderRadius: '18px', boxShadow: 'inset 4px 4px 10px #b8bec7, inset -4px -4px 10px #ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontWeight: 900 }}>{resident.name}</div>
                    <div style={{ color: N.textLight, marginTop: '4px' }}>{resident.email}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: N.tealDark }}>{resident.apartment}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '22px', borderRadius: '24px', background: N.bg, boxShadow: '8px 8px 16px #b8bec7, -8px -8px 16px #ffffff' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '18px' }}>Incident Queue</h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {data.incidents.map((incident) => (
              <div key={incident.id} style={{ padding: '16px', borderRadius: '18px', background: incident.severity === 'medium' ? '#fff2eb' : '#edf7f4' }}>
                <div style={{ fontWeight: 800 }}>{incident.title}</div>
                <div style={{ marginTop: '6px', fontSize: '13px', color: N.textLight }}>
                  {incident.severity} • {new Date(incident.reportedAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default ResidentsPage;
