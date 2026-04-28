import React, { useEffect, useState } from 'react';
import { FileSearch, SlidersHorizontal } from 'lucide-react';
import AppShell from '../components/AppShell';
import StatCard from '../components/StatCard';
import useIntelligenceData from '../hooks/useIntelligenceData';
import { intelligenceService } from '../services/intelligenceService';
import { extractErrorMessage } from '../services/api';
import { N } from '../styles/theme';

const panelStyle = {
  padding: '22px',
  borderRadius: '24px',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.5), rgba(224,229,236,1))',
  boxShadow: '12px 12px 24px rgba(184,190,199,0.9), -8px -8px 18px rgba(255,255,255,0.86)',
};

const DocumentsSimulatorPage = () => {
  const { data, error, setError } = useIntelligenceData();
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
    if (data?.investmentSimulator?.areas?.length && !simArea) {
      setSimArea(data.investmentSimulator.areas[0].id);
    }
  }, [data, simArea]);

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
      title="Docs And Simulator"
      subtitle="A focused page for extracting insight from messy documents and testing what-if investment scenarios."
    >
      {error ? <div style={{ color: '#d64545', marginBottom: '18px' }}>{error}</div> : null}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        <StatCard label="Doc Inputs" value={data?.documentIntelligence?.suggestedInputs?.length || '--'} hint="Suggested source types to analyze." />
        <StatCard label="Simulation Modes" value="4" hint="Transit, rent, AQI, and infrastructure assumptions." tone="warning" />
        <StatCard label="Tracked Markets" value={data?.investmentSimulator?.areas?.length || '--'} hint="Neighborhoods available for scenario testing." tone="success" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginTop: '22px' }}>
        <section style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <FileSearch style={{ width: 18, height: 18, color: N.teal }} />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: N.tealDeep }}>Document Intelligence Layer</h2>
          </div>
          <textarea
            value={documentText}
            onChange={(event) => setDocumentText(event.target.value)}
            placeholder="Paste brochure copy, parking rules, or society bylaws here..."
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
          <div style={{ display: 'grid', gap: '10px', marginTop: '14px', color: N.textLight }}>
            {(data?.documentIntelligence?.suggestedInputs || []).map((item) => (
              <div key={item}>• {item}</div>
            ))}
          </div>
          {documentAnalysis ? (
            <div style={{ marginTop: '16px', display: 'grid', gap: '10px' }}>
              <div><strong>Summary:</strong> {documentAnalysis.summary}</div>
              <div><strong>Extracted:</strong> {documentAnalysis.extractedItems.join(' • ') || 'None yet'}</div>
              <div><strong>Risks:</strong> {documentAnalysis.risks.join(' • ') || 'No obvious warning language detected'}</div>
            </div>
          ) : null}
        </section>

        <section style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <SlidersHorizontal style={{ width: 18, height: 18, color: N.teal }} />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: N.tealDeep }}>What-If Investment Simulator</h2>
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

export default DocumentsSimulatorPage;





