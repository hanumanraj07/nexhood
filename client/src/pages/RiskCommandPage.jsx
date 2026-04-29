import React, { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AlertTriangle, Map, Radar as RadarIcon } from 'lucide-react';
import AppShell from '../components/AppShell';
import StatCard from '../components/StatCard';
import useIntelligenceData from '../hooks/useIntelligenceData';
import { N } from '../styles/theme';

const panelStyle = {
  padding: '22px',
  borderRadius: '24px',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.5), rgba(224,229,236,1))',
  boxShadow: '12px 12px 24px rgba(184,190,199,0.9), -8px -8px 18px rgba(255,255,255,0.86)',
};

const RiskCommandPage = () => {
  const { data, error } = useIntelligenceData();

  const digitalTwinData = useMemo(
    () =>
      (data?.digitalTwin || []).map((area) => ({
        name: area.name,
        growthHeat: area.liveSignals.find((entry) => entry.label === 'Growth Heat')?.value || 0,
        civicStress: area.liveSignals.find((entry) => entry.label === 'Civic Stress')?.value || 0,
      })),
    [data]
  );

  const lineData = useMemo(
    () =>
      (data?.futureRiskRadar || []).map((risk) => ({
        name: risk.name,
        flood: risk.floodRisk,
        pollution: risk.pollutionRisk,
        traffic: risk.trafficPressure,
      })),
    [data]
  );

  return (
    <AppShell
      title="Risk Command"
      subtitle="A dedicated decision surface for future risk, locality stress, and digital twin style live-signal monitoring."
    >
      {error ? <div style={{ color: '#d64545', marginBottom: '18px' }}>{error}</div> : null}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        <StatCard label="Risk Layers" value="5" hint="Flood, heat, pollution, traffic, and overdevelopment." tone="warning" />
        <StatCard label="Twin Views" value={data?.digitalTwin?.length || '--'} hint="Localities with live signal profiles." />
        <StatCard label="High Alert Area" value={data?.futureRiskRadar?.sort((a, b) => b.pollutionRisk - a.pollutionRisk)?.[0]?.name || '--'} hint="Current highest pollution pressure." tone="danger" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginTop: '22px' }}>
        <section style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <RadarIcon style={{ width: 18, height: 18, color: N.teal }} />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: N.tealDeep }}>Future Risk Radar</h2>
          </div>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={240} minHeight={180}>
              <RadarChart data={data?.futureRiskRadar || []}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <Radar dataKey="floodRisk" stroke="#2a9d8f" fill="#2a9d8f" fillOpacity={0.15} />
                <Radar dataKey="pollutionRisk" stroke="#e07b54" fill="#e07b54" fillOpacity={0.12} />
                <Radar dataKey="trafficPressure" stroke="#264653" fill="#264653" fillOpacity={0.1} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Map style={{ width: 18, height: 18, color: N.teal }} />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: N.tealDeep }}>Neighborhood Digital Twin</h2>
          </div>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={240} minHeight={180}>
              <BarChart data={digitalTwinData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="growthHeat" fill="#2a9d8f" radius={[8, 8, 0, 0]} />
                <Bar dataKey="civicStress" fill="#e07b54" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '18px', marginTop: '22px' }}>
        <section style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <AlertTriangle style={{ width: 18, height: 18, color: N.teal }} />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: N.tealDeep }}>Risk Trend Stack</h2>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={240} minHeight={180}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="flood" stroke="#2a9d8f" strokeWidth={3} />
                <Line type="monotone" dataKey="pollution" stroke="#e07b54" strokeWidth={3} />
                <Line type="monotone" dataKey="traffic" stroke="#264653" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section style={panelStyle}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: N.tealDeep, marginBottom: '14px' }}>Project Signals</h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {(data?.digitalTwin || []).slice(0, 3).map((area) => (
              <div key={area.id} style={{ padding: '16px', borderRadius: '18px', background: 'rgba(255,255,255,0.34)' }}>
                <div style={{ fontWeight: 900 }}>{area.name}</div>
                {area.projects.map((project) => (
                  <div key={project.title} style={{ color: N.textLight, marginTop: '6px', fontSize: '14px' }}>
                    {project.title} • {project.impact} impact
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default RiskCommandPage;






