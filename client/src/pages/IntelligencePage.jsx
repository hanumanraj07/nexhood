import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
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
import { BrainCircuit, Building2, CarFront, Clock3, FileSearch, Gauge, HeartPulse, Map, Radar as RadarIcon, SlidersHorizontal, Sparkles, Users } from 'lucide-react';
import AppShell from '../components/AppShell';
import StatCard from '../components/StatCard';
import { intelligenceService } from '../services/intelligenceService';
import { extractErrorMessage } from '../services/api';
import { N } from '../styles/theme';

const panelStyle = {
  padding: '22px',
  borderRadius: '24px',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.5), rgba(224,229,236,1))',
  boxShadow: '12px 12px 24px rgba(184,190,199,0.9), -8px -8px 18px rgba(255,255,255,0.86)',
};

const sectionTitleStyle = {
  fontSize: '20px',
  fontWeight: 800,
  color: N.tealDeep,
  marginBottom: '16px',
};

const iconStyle = { width: 18, height: 18, color: N.teal };

const lifestyleLabels = {
  family: 'Family-first',
  commuter: 'Commute-first',
  investor: 'Investor',
  wellness: 'Wellness',
};

const compareRadarData = (rows = []) => {
  const byMetric = {};
  rows.forEach((row) => {
    Object.entries(row.residentPulse).forEach(([metric, value]) => {
      if (!byMetric[metric]) byMetric[metric] = { metric };
      byMetric[metric][row.name] = value;
    });
  });
  return Object.values(byMetric);
};

const featureList = [
  'Lifestyle Match Score',
  'Future Risk Radar',
  'Neighborhood Digital Twin',
  'Property Decision Assistant',
  'Resident Sentiment Engine',
  'Commute Intelligence',
  'Smart Parking Command Center',
  'Society Operations Score',
  'Document Intelligence Layer',
  'What-If Investment Simulator',
];

const IntelligencePage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState('family');
  const [documentText, setDocumentText] = useState('');
  const [documentAnalysis, setDocumentAnalysis] = useState(null);
  const [simArea, setSimArea] = useState('');
  const [assumptions, setAssumptions] = useState({
    metroDelayMonths: 4,
    rentGrowth: 8,
    aqiDeterioration: 3,
    infraBoost: 6,
  });
  const [simulation, setSimulation] = useState(null);
  const [loadingSimulation, setLoadingSimulation] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const payload = await intelligenceService.getOverview();
        setData(payload);
        setSimArea(payload.investmentSimulator.areas[0]?.id || '');
      } catch (err) {
        setError(extractErrorMessage(err));
      }
    };

    load();
  }, []);

  const activeProfile = useMemo(
    () => data?.lifestyleMatch?.find((entry) => entry.profile === profile),
    [data, profile]
  );

  const digitalTwinData = useMemo(
    () =>
      (data?.digitalTwin || []).map((area) => ({
        name: area.name,
        growthHeat: area.liveSignals.find((entry) => entry.label === 'Growth Heat')?.value || 0,
        civicStress: area.liveSignals.find((entry) => entry.label === 'Civic Stress')?.value || 0,
      })),
    [data]
  );

  const sentimentRadar = useMemo(() => compareRadarData((data?.sentimentEngine || []).slice(0, 2)), [data]);

  const selectedProperties = useMemo(
    () => (data?.propertyAssistant?.properties || []).slice(0, 3),
    [data]
  );

  const propertyRecommendations = useMemo(() => {
    if (!selectedProperties.length || !data?.futureRiskRadar) return [];
    return selectedProperties.map((property) => {
      const risk = data.futureRiskRadar.find((entry) => entry.id === property.neighborhoodId);
      const livability = Math.round(100 - ((risk?.pollutionRisk || 0) + (risk?.trafficPressure || 0)) / 4);
      const investment = Math.round(property.monthlyRent * 12 / (property.priceCr * 10000000) * 1000 + 60);
      return {
        ...property,
        livability,
        investment,
        verdict:
          livability > investment
            ? 'Best for end-use'
            : investment > livability + 6
              ? 'Best for upside'
              : 'Balanced pick',
      };
    });
  }, [selectedProperties, data]);

  const handleDocumentAnalysis = async () => {
    try {
      const analysis = await intelligenceService.analyzeDocument(documentText);
      setDocumentAnalysis(analysis);
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  const handleSimulate = async () => {
    if (!simArea) return;
    setLoadingSimulation(true);
    try {
      const result = await intelligenceService.simulateInvestment({
        areaId: simArea,
        assumptions,
      });
      setSimulation(result);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoadingSimulation(false);
    }
  };

  return (
    <AppShell
      title="Intelligence Lab"
      subtitle="A high-impact workspace for the next ten standout NexHood features, implemented as interactive product modules."
      actions={
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {featureList.slice(0, 5).map((item) => (
            <span
              key={item}
              style={{
                padding: '8px 12px',
                borderRadius: '999px',
                boxShadow: 'inset 4px 4px 10px #b8bec7, inset -4px -4px 10px #ffffff',
                color: N.tealDark,
                fontWeight: 700,
                fontSize: '12px',
              }}
            >
              {item}
            </span>
          ))}
        </div>
      }
    >
      {error ? <div style={{ color: '#d64545', marginBottom: '18px' }}>{error}</div> : null}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        <StatCard label="Feature Tracks" value="10" hint="All ten standout ideas are now represented inside the product." />
        <StatCard label="Active Models" value="3" hint="Document scan, lifestyle ranking, and investment simulation." tone="success" />
        <StatCard label="Live Data Sources" value="7" hint="Neighborhood, parking, commute, sentiment, risk, society ops, and property layers." />
        <StatCard label="Decision Surfaces" value="1 Lab" hint="One place to pitch, test, and extend extraordinary product ideas." tone="warning" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginTop: '22px' }}>
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <BrainCircuit style={iconStyle} />
            <h2 style={sectionTitleStyle}>1. Lifestyle Match Score</h2>
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
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }} style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <RadarIcon style={iconStyle} />
            <h2 style={sectionTitleStyle}>2. Future Risk Radar</h2>
          </div>
          <div style={{ height: 290 }}>
            <ResponsiveContainer width="100%" height="100%">
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
        </motion.section>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginTop: '22px' }}>
        <section style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Map style={iconStyle} />
            <h2 style={sectionTitleStyle}>3. Neighborhood Digital Twin</h2>
          </div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '16px' }}>
            {(data?.digitalTwin || []).slice(0, 2).map((area) => (
              <div key={area.id} style={{ padding: '16px', borderRadius: '18px', background: 'rgba(255,255,255,0.38)' }}>
                <div style={{ fontWeight: 900 }}>{area.name}</div>
                {area.projects.map((project) => (
                  <div key={project.title} style={{ color: N.textLight, marginTop: '6px', fontSize: '14px' }}>
                    {project.title} • {project.eta}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Building2 style={iconStyle} />
            <h2 style={sectionTitleStyle}>4. Property Decision Assistant</h2>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            {propertyRecommendations.map((property) => (
              <div key={property.id} style={{ padding: '16px', borderRadius: '18px', boxShadow: 'inset 4px 4px 10px #b8bec7, inset -4px -4px 10px #ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontWeight: 900 }}>{property.name}</div>
                    <div style={{ color: N.textLight, marginTop: '4px' }}>{property.neighborhoodName} • Rs. {property.priceCr} Cr • {property.sizeSqft} sqft</div>
                  </div>
                  <div style={{ color: N.tealDark, fontWeight: 800 }}>{property.verdict}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px', marginTop: '12px' }}>
                  <div><strong>Livability:</strong> {property.livability}</div>
                  <div><strong>Investment:</strong> {property.investment}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginTop: '22px' }}>
        <section style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Users style={iconStyle} />
            <h2 style={sectionTitleStyle}>5. Resident Sentiment Engine</h2>
          </div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={sentimentRadar}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <Radar dataKey={data?.sentimentEngine?.[0]?.name} stroke="#2a9d8f" fill="#2a9d8f" fillOpacity={0.16} />
                <Radar dataKey={data?.sentimentEngine?.[1]?.name} stroke="#e07b54" fill="#e07b54" fillOpacity={0.12} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'grid', gap: '10px', marginTop: '14px' }}>
            {(data?.sentimentEngine || []).slice(0, 2).map((row) => (
              <div key={row.id} style={{ padding: '12px 14px', borderRadius: '16px', background: 'rgba(255,255,255,0.3)' }}>
                <strong>{row.name}:</strong> {row.highlights[2]}
              </div>
            ))}
          </div>
        </section>

        <section style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Clock3 style={iconStyle} />
            <h2 style={sectionTitleStyle}>6. Commute Intelligence</h2>
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
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginTop: '22px' }}>
        <section style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <CarFront style={iconStyle} />
            <h2 style={sectionTitleStyle}>7. Smart Parking Command Center</h2>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Gauge style={iconStyle} />
            <h2 style={sectionTitleStyle}>8. Society Operations Score</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '54px', fontWeight: 900, color: N.teal }}>{data?.societyOperations?.total ?? '--'}</div>
            <div style={{ color: N.textLight, lineHeight: 1.6 }}>
              Composite score across visitor accountability, parking discipline, incident response, and resident satisfaction.
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <FileSearch style={iconStyle} />
            <h2 style={sectionTitleStyle}>9. Document Intelligence Layer</h2>
          </div>
          <textarea
            value={documentText}
            onChange={(event) => setDocumentText(event.target.value)}
            placeholder="Paste brochure copy, parking rules, or society bylaws here..."
            style={{
              width: '100%',
              minHeight: '160px',
              borderRadius: '18px',
              padding: '16px',
              background: N.bg,
              boxShadow: 'inset 4px 4px 10px #b8bec7, inset -4px -4px 10px #ffffff',
              resize: 'vertical',
            }}
          />
          <button
            type="button"
            onClick={handleDocumentAnalysis}
            style={{
              marginTop: '12px',
              padding: '12px 16px',
              borderRadius: '16px',
              background: N.teal,
              color: '#fff',
              fontWeight: 800,
            }}
          >
            Analyze Document
          </button>
          {documentAnalysis ? (
            <div style={{ marginTop: '16px', display: 'grid', gap: '10px' }}>
              <div><strong>Summary:</strong> {documentAnalysis.summary}</div>
              <div><strong>Extracted:</strong> {documentAnalysis.extractedItems.join(' • ') || 'None yet'}</div>
              <div><strong>Risks:</strong> {documentAnalysis.risks.join(' • ') || 'No obvious warning language detected'}</div>
            </div>
          ) : null}
        </section>

        <section style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <SlidersHorizontal style={iconStyle} />
            <h2 style={sectionTitleStyle}>10. What-If Investment Simulator</h2>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <select value={simArea} onChange={(event) => setSimArea(event.target.value)} style={inputStyle}>
              {(data?.investmentSimulator?.areas || []).map((area) => (
                <option key={area.id} value={area.id}>{area.name}</option>
              ))}
            </select>
            {[
              ['metroDelayMonths', 'Metro delay (months)', 24],
              ['rentGrowth', 'Rent growth (%)', 20],
              ['aqiDeterioration', 'AQI deterioration', 15],
              ['infraBoost', 'Infra boost', 20],
            ].map(([key, label, max]) => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>{label}</span>
                  <strong>{assumptions[key]}</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max={max}
                  value={assumptions[key]}
                  onChange={(event) => setAssumptions((current) => ({ ...current, [key]: Number(event.target.value) }))}
                  style={{ width: '100%' }}
                />
              </div>
            ))}
            <button type="button" onClick={handleSimulate} style={simulateButtonStyle}>
              {loadingSimulation ? 'Running...' : 'Run Simulation'}
            </button>
            {simulation ? (
              <div style={{ padding: '16px', borderRadius: '18px', background: 'rgba(255,255,255,0.32)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px' }}>
                  <div><strong>Baseline:</strong> {simulation.baselineScore}</div>
                  <div><strong>Adjusted:</strong> {simulation.adjustedScore}</div>
                  <div><strong>Projected ROI:</strong> {simulation.projectedRoi}%</div>
                </div>
                <div style={{ marginTop: '10px', color: N.textLight }}>{simulation.recommendation}</div>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <div style={{ marginTop: '22px', ...panelStyle }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <Sparkles style={iconStyle} />
          <h2 style={sectionTitleStyle}>Implementation Snapshot</h2>
        </div>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={(data?.futureRiskRadar || []).map((risk) => ({ name: risk.name, growth: 100 - risk.overdevelopmentRisk, safety: 100 - risk.floodRisk, air: 100 - risk.pollutionRisk }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="growth" stroke="#2a9d8f" strokeWidth={3} />
              <Line type="monotone" dataKey="safety" stroke="#264653" strokeWidth={3} />
              <Line type="monotone" dataKey="air" stroke="#e07b54" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppShell>
  );
};

const inputStyle = {
  width: '100%',
  borderRadius: '16px',
  background: N.bg,
  boxShadow: 'inset 4px 4px 10px #b8bec7, inset -4px -4px 10px #ffffff',
  padding: '14px 16px',
  color: N.text,
};

const simulateButtonStyle = {
  padding: '12px 16px',
  borderRadius: '16px',
  background: N.teal,
  color: '#fff',
  fontWeight: 800,
};

export default IntelligencePage;





