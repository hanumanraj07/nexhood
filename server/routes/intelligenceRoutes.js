const express = require('express');
const { readDb } = require('../data/store');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

const profileWeights = {
  family: {
    education: 0.3,
    safety: 0.24,
    environment: 0.12,
    waterUtilities: 0.16,
    infrastructure: 0.1,
    growthPotential: 0.08,
  },
  commuter: {
    education: 0.08,
    safety: 0.12,
    environment: 0.1,
    waterUtilities: 0.1,
    infrastructure: 0.34,
    growthPotential: 0.26,
  },
  investor: {
    education: 0.08,
    safety: 0.1,
    environment: 0.08,
    waterUtilities: 0.08,
    infrastructure: 0.28,
    growthPotential: 0.38,
  },
  wellness: {
    education: 0.1,
    safety: 0.18,
    environment: 0.28,
    waterUtilities: 0.22,
    infrastructure: 0.12,
    growthPotential: 0.1,
  },
};

const calculateLifestyleMatches = (neighborhoods) =>
  Object.entries(profileWeights).map(([profile, weights]) => ({
    profile,
    rankings: neighborhoods
      .map((area) => ({
        id: area.id,
        name: area.name,
        score: Math.round(
          Object.entries(weights).reduce((total, [key, weight]) => total + area.subScores[key] * weight, 0)
        ),
        reasons: [
          `Education ${area.subScores.education}`,
          `Safety ${area.subScores.safety}`,
          `Infrastructure ${area.subScores.infrastructure}`,
        ],
      }))
      .sort((a, b) => b.score - a.score),
  }));

const buildRiskRadar = (neighborhoods) =>
  neighborhoods.map((area) => ({
    id: area.id,
    name: area.name,
    floodRisk: Math.max(18, Math.round(100 - area.subScores.waterUtilities * 0.92)),
    heatStress: Math.max(20, Math.round(100 - area.subScores.environment * 0.88)),
    pollutionRisk: Math.min(100, Math.round(area.metrics.averageAqi * 0.72)),
    trafficPressure: Math.max(26, Math.round(100 - area.subScores.infrastructure * 0.74 + area.subScores.growthPotential * 0.18)),
    overdevelopmentRisk: Math.max(22, Math.round(area.subScores.growthPotential * 0.78)),
  }));

const buildDigitalTwin = (neighborhoods) =>
  neighborhoods.map((area) => ({
    id: area.id,
    name: area.name,
    liveSignals: [
      { label: 'Traffic Flow', value: Math.max(32, area.subScores.infrastructure - 8), tone: 'teal' },
      { label: 'Green Cover Health', value: area.metrics.greenCover * 3, tone: 'green' },
      { label: 'Civic Stress', value: Math.round((100 - area.subScores.waterUtilities) * 0.8), tone: 'warm' },
      { label: 'Growth Heat', value: area.subScores.growthPotential, tone: 'amber' },
    ],
    projects: area.infrastructureProjects,
  }));

const sampleProperties = (neighborhoods) => [
  {
    id: 'prop-baner-1',
    name: 'Skyline Residency',
    neighborhoodId: neighborhoods[0]?.id,
    neighborhoodName: neighborhoods[0]?.name,
    priceCr: 1.48,
    sizeSqft: 1320,
    monthlyRent: 42000,
    possession: 'Ready',
    builderGrade: 'A-',
  },
  {
    id: 'prop-wakad-1',
    name: 'Metro Edge',
    neighborhoodId: neighborhoods[1]?.id,
    neighborhoodName: neighborhoods[1]?.name,
    priceCr: 1.12,
    sizeSqft: 1240,
    monthlyRent: 36500,
    possession: 'Q2 2027',
    builderGrade: 'B+',
  },
  {
    id: 'prop-kothrud-1',
    name: 'Cedar Heights',
    neighborhoodId: neighborhoods[2]?.id,
    neighborhoodName: neighborhoods[2]?.name,
    priceCr: 1.62,
    sizeSqft: 1280,
    monthlyRent: 44500,
    possession: 'Ready',
    builderGrade: 'A',
  },
  {
    id: 'prop-hinjawadi-1',
    name: 'Orbit Tech Park Homes',
    neighborhoodId: neighborhoods[3]?.id,
    neighborhoodName: neighborhoods[3]?.name,
    priceCr: 0.96,
    sizeSqft: 1180,
    monthlyRent: 33200,
    possession: 'Q4 2026',
    builderGrade: 'B',
  },
];

const buildSentiment = (neighborhoods) =>
  neighborhoods.map((area) => ({
    id: area.id,
    name: area.name,
    residentPulse: {
      safety: Math.max(50, area.subScores.safety + 6),
      noise: Math.max(38, 100 - Math.round(area.metrics.averageAqi * 0.35)),
      water: area.subScores.waterUtilities,
      parking: Math.max(42, area.subScores.infrastructure - 6),
      maintenance: Math.max(58, area.nexScore - 7),
    },
    highlights: [
      `${Math.round(area.subScores.safety / 10)} out of 10 residents mention dependable policing.`,
      `${Math.round(area.metrics.schoolsNearby / 2)} education-related positives surfaced this month.`,
      `Primary concern cluster: ${area.metrics.averageAqi > 100 ? 'air quality and traffic' : 'parking and access control'}.`,
    ],
  }));

const buildCommute = (neighborhoods) =>
  neighborhoods.map((area) => ({
    id: area.id,
    name: area.name,
    office: {
      peak: `${22 + Math.round((100 - area.subScores.infrastructure) / 4)} min`,
      offPeak: `${16 + Math.round((100 - area.subScores.infrastructure) / 6)} min`,
      rainy: `${28 + Math.round((100 - area.subScores.infrastructure) / 3)} min`,
    },
    school: {
      peak: `${12 + Math.round((100 - area.subScores.education) / 8)} min`,
      offPeak: `${8 + Math.round((100 - area.subScores.education) / 12)} min`,
      rainy: `${16 + Math.round((100 - area.subScores.education) / 7)} min`,
    },
    hospital: {
      peak: `${15 + Math.round((100 - area.subScores.infrastructure) / 7)} min`,
      offPeak: `${11 + Math.round((100 - area.subScores.infrastructure) / 10)} min`,
      rainy: `${19 + Math.round((100 - area.subScores.infrastructure) / 6)} min`,
    },
  }));

const buildParkingCommandCenter = (db) => ({
  liveOccupancy: db.society.guestSlots.map((slot) => ({
    slotId: slot.slotId,
    status: slot.status,
    priority: slot.status === 'occupied' ? 'in-use' : 'open',
  })),
  alerts: [
    {
      id: 'alert-1',
      label: 'Overstay risk',
      detail: `${db.passes.filter((pass) => pass.status === 'active').length} active passes need expiry watch.`,
      severity: 'medium',
    },
    {
      id: 'alert-2',
      label: 'Peak hour load',
      detail: `${db.society.guestSlots.filter((slot) => slot.status === 'occupied').length}/${db.society.guestSlots.length} guest slots are currently filled.`,
      severity: 'low',
    },
  ],
  guardPerformance: [
    { label: 'Average scan time', value: '18 sec' },
    { label: 'Manual interventions', value: `${db.incidents.length}` },
    { label: 'Same-day visitor passes', value: `${db.passes.length}` },
  ],
});

const buildSocietyOpsScore = (db) => {
  const occupiedRatio = db.society.guestSlots.filter((slot) => slot.status === 'occupied').length / db.society.guestSlots.length;
  const incidentPenalty = db.incidents.length * 4;
  const score = Math.max(54, Math.round(86 - occupiedRatio * 12 - incidentPenalty));

  return {
    total: score,
    categories: [
      { label: 'Parking Discipline', value: Math.max(52, score - 4) },
      { label: 'Visitor Accountability', value: Math.max(56, score + 2) },
      { label: 'Incident Response', value: Math.max(48, score - 8) },
      { label: 'Resident Satisfaction', value: Math.max(58, score + 1) },
    ],
  };
};

const analyzeDocumentText = (text = '') => {
  const lower = text.toLowerCase();
  return {
    extractedItems: [
      lower.includes('metro') ? 'Mentions metro or transit access' : null,
      lower.includes('possession') ? 'Contains possession or handover timing' : null,
      lower.includes('clubhouse') ? 'Mentions amenity promise: clubhouse' : null,
      lower.includes('parking') ? 'Contains parking-related clause' : null,
      lower.includes('maintenance') ? 'Contains maintenance or recurring fee mention' : null,
    ].filter(Boolean),
    risks: [
      lower.includes('subject to approval') ? 'Approval-dependent promise detected' : null,
      lower.includes('indicative') ? 'Non-binding or indicative language detected' : null,
      lower.includes('proposed') ? 'Future infrastructure claim may be speculative' : null,
    ].filter(Boolean),
    summary:
      text.trim().length > 0
        ? 'The uploaded document has been scanned for amenity promises, delivery timeline language, and risk markers.'
        : 'Paste brochure text, society bylaws, or builder promises to extract signals.',
  };
};

const runInvestmentSimulation = (area, assumptions) => {
  const {
    metroDelayMonths = 0,
    rentGrowth = 8,
    aqiDeterioration = 0,
    infraBoost = 0,
  } = assumptions;

  const baseScore = area.nexScore;
  const adjustedScore = Math.max(
    30,
    Math.min(
      99,
      Math.round(baseScore - metroDelayMonths * 0.35 - aqiDeterioration * 0.4 + infraBoost * 0.45 + rentGrowth * 0.3)
    )
  );

  const projectedRoi = Number((6.4 + rentGrowth * 0.22 + infraBoost * 0.12 - metroDelayMonths * 0.05 - aqiDeterioration * 0.04).toFixed(1));

  return {
    baselineScore: baseScore,
    adjustedScore,
    projectedRoi,
    recommendation:
      adjustedScore >= 84
        ? 'Strong upside with manageable downside.'
        : adjustedScore >= 74
          ? 'Balanced play if you are comfortable with moderate volatility.'
          : 'High caution. The downside starts to outweigh the discount.',
  };
};

router.use(requireAuth);

router.get('/overview', async (_req, res) => {
  const db = await readDb();
  const neighborhoods = db.neighborhoods;
  const properties = sampleProperties(neighborhoods);

  res.json({
    success: true,
    payload: {
      lifestyleMatch: calculateLifestyleMatches(neighborhoods),
      futureRiskRadar: buildRiskRadar(neighborhoods),
      digitalTwin: buildDigitalTwin(neighborhoods),
      propertyAssistant: {
        properties,
      },
      sentimentEngine: buildSentiment(neighborhoods),
      commuteIntelligence: buildCommute(neighborhoods),
      parkingCommandCenter: buildParkingCommandCenter(db),
      societyOperations: buildSocietyOpsScore(db),
      documentIntelligence: {
        suggestedInputs: [
          'Builder brochure promises',
          'Society bye-laws',
          'Parking policy PDFs',
          'Government project extracts',
        ],
      },
      investmentSimulator: {
        areas: neighborhoods.map((area) => ({
          id: area.id,
          name: area.name,
          nexScore: area.nexScore,
        })),
      },
    },
  });
});

router.post('/document-insights', async (req, res) => {
  const { text } = req.body;
  res.json({
    success: true,
    analysis: analyzeDocumentText(text),
  });
});

router.post('/simulate', async (req, res) => {
  const db = await readDb();
  const { areaId, assumptions = {} } = req.body;
  const area = db.neighborhoods.find((entry) => entry.id === areaId) || db.neighborhoods[0];

  res.json({
    success: true,
    result: runInvestmentSimulation(area, assumptions),
  });
});

module.exports = router;
