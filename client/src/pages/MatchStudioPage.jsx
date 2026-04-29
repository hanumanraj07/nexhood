import React, { useMemo, useState } from 'react';
import { BrainCircuit, Building2, Users } from 'lucide-react';
import AppShell from '../components/AppShell';
import StatCard from '../components/StatCard';
import useIntelligenceData from '../hooks/useIntelligenceData';
import { N } from '../styles/theme';

const lifestyleLabels = {
  family: 'Family-first',
  commuter: 'Commute-first',
  investor: 'Investor',
  wellness: 'Wellness',
};

const panelStyle = {
  padding: '22px',
  borderRadius: '24px',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.5), rgba(224,229,236,1))',
  boxShadow: '12px 12px 24px rgba(184,190,199,0.9), -8px -8px 18px rgba(255,255,255,0.86)',
};

const MatchStudioPage = () => {
  const { data, error } = useIntelligenceData();
  const [profile, setProfile] = useState('family');

  const activeProfile = useMemo(
    () => data?.lifestyleMatch?.find((entry) => entry.profile === profile),
    [data, profile]
  );

  const properties = useMemo(() => data?.propertyAssistant?.properties || [], [data]);

  const recommendations = useMemo(() => {
    if (!properties.length || !data?.futureRiskRadar) return [];
    return properties.map((property) => {
      const risk = data.futureRiskRadar.find((entry) => entry.id === property.neighborhoodId);
      return {
        ...property,
        livability: Math.round(100 - ((risk?.pollutionRisk || 0) + (risk?.trafficPressure || 0)) / 4),
        appreciation: Math.round(60 + (risk ? 100 - risk.overdevelopmentRisk : 12) / 2),
      };
    });
  }, [properties, data]);

  return (
    <AppShell
      title="Match Studio"
      subtitle="A dedicated workspace for lifestyle ranking, fit scoring, and property picks that feel tailored instead of generic."
    >
      {error ? <div style={{ color: '#d64545', marginBottom: '18px' }}>{error}</div> : null}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        <StatCard label="Profiles" value="4" hint="Family, commuter, investor, and wellness modes." />
        <StatCard label="Property Picks" value={properties.length || '--'} hint="Shortlisted decision-ready properties." tone="success" />
        <StatCard label="Top Match" value={activeProfile?.rankings?.[0]?.name || '--'} hint="Current highest-fit locality for the chosen profile." />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginTop: '22px' }}>
        <section style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <BrainCircuit style={{ width: 18, height: 18, color: N.teal }} />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: N.tealDeep }}>Lifestyle Match Score</h2>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {Object.entries(lifestyleLabels).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setProfile(key)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '16px',
                  background: profile === key ? '#edf7f4' : N.bg,
                  boxShadow: '8px 8px 16px #b8bec7, -8px -8px 16px #ffffff',
                  color: profile === key ? N.tealDark : N.text,
                  fontWeight: 800,
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            {(activeProfile?.rankings || []).slice(0, 4).map((rank, index) => (
              <div key={rank.id} style={{ padding: '16px', borderRadius: '18px', boxShadow: 'inset 4px 4px 10px #b8bec7, inset -4px -4px 10px #ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 900 }}>{index + 1}. {rank.name}</div>
                    <div style={{ color: N.textLight, marginTop: '4px' }}>{rank.reasons.join(' • ')}</div>
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: N.teal }}>{rank.score}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Building2 style={{ width: 18, height: 18, color: N.teal }} />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: N.tealDeep }}>Property Decision Assistant</h2>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            {recommendations.map((property) => (
              <div key={property.id} style={{ padding: '16px', borderRadius: '18px', background: 'rgba(255,255,255,0.34)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontWeight: 900 }}>{property.name}</div>
                    <div style={{ color: N.textLight, marginTop: '4px' }}>{property.neighborhoodName} • Rs. {property.priceCr} Cr</div>
                  </div>
                  <div style={{ color: N.tealDark, fontWeight: 800 }}>{property.possession}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginTop: '12px' }}>
                  <div><strong>Livability:</strong> {property.livability}</div>
                  <div><strong>Appreciation:</strong> {property.appreciation}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section style={{ ...panelStyle, marginTop: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <Users style={{ width: 18, height: 18, color: N.teal }} />
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: N.tealDeep }}>How To Use This Page</h2>
        </div>
        <div style={{ display: 'grid', gap: '10px', color: N.textLight, lineHeight: 1.6 }}>
          <div>Choose a lifestyle mode to instantly reorder localities by what matters to that persona.</div>
          <div>Use the property cards to compare purchase price against quality-of-life and upside signals.</div>
          <div>This page is the easiest feature to demo when you want NexHood to feel personalized, not static.</div>
        </div>
      </section>
    </AppShell>
  );
};

export default MatchStudioPage;






