import React, { useMemo } from 'react';
import { CarFront, Clock3, Gauge, Users } from 'lucide-react';
import AppShell from '../components/AppShell';
import StatCard from '../components/StatCard';
import useIntelligenceData from '../hooks/useIntelligenceData';
import { N } from '../styles/neumorphism';

const panelStyle = {
  padding: '22px',
  borderRadius: '24px',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.5), rgba(224,229,236,1))',
  boxShadow: '12px 12px 24px rgba(184,190,199,0.9), -8px -8px 18px rgba(255,255,255,0.86)',
};

const OpsCenterPage = () => {
  const { data, error } = useIntelligenceData();

  const busiestArea = useMemo(
    () => data?.commuteIntelligence?.sort((a, b) => parseInt(b.office.peak, 10) - parseInt(a.office.peak, 10))?.[0]?.name,
    [data]
  );

  return (
    <AppShell
      title="Ops Center"
      subtitle="A society-focused feature surface for commute intelligence, parking orchestration, resident sentiment, and operational scoring."
    >
      {error ? <div style={{ color: '#d64545', marginBottom: '18px' }}>{error}</div> : null}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        <StatCard label="Ops Score" value={data?.societyOperations?.total ?? '--'} hint="Composite society operations grade." tone="success" />
        <StatCard label="Active Alerts" value={data?.parkingCommandCenter?.alerts?.length ?? '--'} hint="Parking and throughput alerts." tone="warning" />
        <StatCard label="Slowest Commute" value={busiestArea || '--'} hint="Peak office travel pressure hotspot." />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginTop: '22px' }}>
        <section style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <CarFront style={{ width: 18, height: 18, color: N.teal }} />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: N.tealDeep }}>Smart Parking Command Center</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '10px' }}>
            {(data?.parkingCommandCenter?.liveOccupancy || []).slice(0, 8).map((slot) => (
              <div
                key={slot.slotId}
                style={{
                  padding: '12px',
                  borderRadius: '16px',
                  textAlign: 'center',
                  background: slot.status === 'open' || slot.status === 'available' ? '#edf7f4' : '#fff2eb',
                  color: slot.status === 'open' || slot.status === 'available' ? N.tealDark : '#b85c38',
                  fontWeight: 800,
                }}
              >
                <div>{slot.slotId}</div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>{slot.status}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gap: '10px', marginTop: '16px' }}>
            {(data?.parkingCommandCenter?.alerts || []).map((alert) => (
              <div key={alert.id} style={{ padding: '12px 14px', borderRadius: '16px', background: alert.severity === 'medium' ? '#fff2eb' : 'rgba(255,255,255,0.3)' }}>
                <strong>{alert.label}:</strong> {alert.detail}
              </div>
            ))}
          </div>
        </section>

        <section style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Gauge style={{ width: 18, height: 18, color: N.teal }} />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: N.tealDeep }}>Society Operations Score</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '54px', fontWeight: 900, color: N.teal }}>{data?.societyOperations?.total ?? '--'}</div>
            <div style={{ color: N.textLight, lineHeight: 1.6 }}>
              Measures parking discipline, visitor accountability, response speed, and resident experience.
            </div>
          </div>
          <div style={{ display: 'grid', gap: '10px' }}>
            {(data?.societyOperations?.categories || []).map((category) => (
              <div key={category.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>{category.label}</span>
                  <strong>{category.value}</strong>
                </div>
                <div style={{ height: '8px', borderRadius: '999px', background: 'rgba(38,70,83,0.08)' }}>
                  <div style={{ width: `${category.value}%`, height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #2a9d8f, #264653)' }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginTop: '22px' }}>
        <section style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Clock3 style={{ width: 18, height: 18, color: N.teal }} />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: N.tealDeep }}>Commute Intelligence</h2>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            {(data?.commuteIntelligence || []).map((area) => (
              <div key={area.id} style={{ padding: '16px', borderRadius: '18px', boxShadow: 'inset 4px 4px 10px #b8bec7, inset -4px -4px 10px #ffffff' }}>
                <div style={{ fontWeight: 900 }}>{area.name}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px', marginTop: '10px' }}>
                  <div><strong>Office:</strong> {area.office.peak}</div>
                  <div><strong>School:</strong> {area.school.peak}</div>
                  <div><strong>Hospital:</strong> {area.hospital.peak}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Users style={{ width: 18, height: 18, color: N.teal }} />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: N.tealDeep }}>Resident Sentiment Engine</h2>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            {(data?.sentimentEngine || []).map((row) => (
              <div key={row.id} style={{ padding: '16px', borderRadius: '18px', background: 'rgba(255,255,255,0.34)' }}>
                <div style={{ fontWeight: 900 }}>{row.name}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px', marginTop: '10px', color: N.textLight }}>
                  <div>Safety {row.residentPulse.safety}</div>
                  <div>Noise {row.residentPulse.noise}</div>
                  <div>Water {row.residentPulse.water}</div>
                  <div>Parking {row.residentPulse.parking}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default OpsCenterPage;
