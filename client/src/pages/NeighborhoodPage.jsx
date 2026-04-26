import React, { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import AppShell from '../components/AppShell';
import { neighborhoodService } from '../services/neighborhoodService';
import { extractErrorMessage } from '../services/api';
import { N } from '../styles/neumorphism';

const scoreKeys = [
  { key: 'education', label: 'Education' },
  { key: 'safety', label: 'Safety' },
  { key: 'environment', label: 'Environment' },
  { key: 'waterUtilities', label: 'Utilities' },
  { key: 'infrastructure', label: 'Infra' },
  { key: 'growthPotential', label: 'Growth' },
];

const markerColor = (score) => {
  if (score >= 82) return '#2a9d8f';
  if (score >= 76) return '#e9a03b';
  return '#d64545';
};

const NeighborhoodPage = () => {
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [selected, setSelected] = useState([]);
  const [details, setDetails] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const result = await neighborhoodService.list();
        setNeighborhoods(result);
        setSelected(result.slice(0, 2).map((item) => item.id));
      } catch (err) {
        setError(extractErrorMessage(err));
      }
    };

    load();
  }, []);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const missingIds = selected.filter((id) => !details[id]);
        if (!missingIds.length) return;

        const enriched = await Promise.all(
          missingIds.map(async (id) => {
            const neighborhood = await neighborhoodService.getDetails(id);
            return [id, neighborhood];
          })
        );

        setDetails((current) => ({
          ...current,
          ...Object.fromEntries(enriched),
        }));
      } catch (err) {
        setError(extractErrorMessage(err));
      }
    };

    if (selected.length) {
      loadDetails();
    }
  }, [selected, details]);

  const compared = useMemo(() => neighborhoods.filter((item) => selected.includes(item.id)), [neighborhoods, selected]);

  const radarData = scoreKeys.map((entry) => {
    const row = { metric: entry.label };
    compared.forEach((item) => {
      row[item.name] = item.subScores[entry.key];
    });
    return row;
  });

  const comparisonBars = compared.map((item) => ({
    name: item.name,
    nexScore: item.nexScore,
    averageRent: item.metrics.averageRent,
    averageAqi: item.metrics.averageAqi,
  }));

  const toggleSelection = (id) => {
    setSelected((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }
      if (current.length === 3) {
        return [...current.slice(1), id];
      }
      return [...current, id];
    });
  };

  const mapCenter = compared[0]?.coordinates
    ? [compared[0].coordinates.lat, compared[0].coordinates.lng]
    : [18.559, 73.7868];

  return (
    <AppShell
      title="Neighborhood Explorer"
      subtitle="Compare civic quality, utility stability, air quality, and appreciation signals before you commit to a property."
    >
      {error ? <div style={{ color: '#d64545', marginBottom: '18px' }}>{error}</div> : null}

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '18px', marginBottom: '22px' }}>
        <div
          style={{
            padding: '22px',
            borderRadius: '24px',
            background: N.bg,
            boxShadow: '8px 8px 16px #b8bec7, -8px -8px 16px #ffffff',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '14px' }}>Interactive Map</h2>
          <div style={{ height: 360, overflow: 'hidden', borderRadius: '18px' }}>
            <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {neighborhoods.map((area) => (
                <CircleMarker
                  key={area.id}
                  center={[area.coordinates.lat, area.coordinates.lng]}
                  pathOptions={{
                    color: markerColor(area.nexScore),
                    fillColor: markerColor(area.nexScore),
                    fillOpacity: selected.includes(area.id) ? 0.9 : 0.5,
                  }}
                  radius={selected.includes(area.id) ? 16 : 12}
                  eventHandlers={{
                    click: () => toggleSelection(area.id),
                  }}
                >
                  <Popup>
                    <strong>{area.name}</strong>
                    <br />
                    NexScore: {area.nexScore}
                    <br />
                    AQI: {area.metrics.averageAqi}
                    {area.liveAqi?.locationName ? (
                      <>
                        <br />
                        Live source: {area.liveAqi.locationName}
                      </>
                    ) : null}
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div
          style={{
            padding: '22px',
            borderRadius: '24px',
            background: N.bg,
            boxShadow: '8px 8px 16px #b8bec7, -8px -8px 16px #ffffff',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '14px' }}>Pick Up To 3 Areas</h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {neighborhoods.map((area) => {
              const active = selected.includes(area.id);
              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => toggleSelection(area.id)}
                  style={{
                    textAlign: 'left',
                    padding: '16px',
                    borderRadius: '18px',
                    background: N.bg,
                    boxShadow: active
                      ? 'inset 6px 6px 14px #b8bec7, inset -6px -6px 14px #ffffff'
                      : '8px 8px 16px #b8bec7, -8px -8px 16px #ffffff',
                    border: `2px solid ${active ? N.teal : 'transparent'}`,
                  }}
                  >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 900 }}>{area.name}</div>
                      <div style={{ color: N.textLight, marginTop: '4px' }}>{area.city} • {area.pincode}</div>
                      {area.liveAqi?.aqi ? (
                        <div style={{ color: N.tealDark, marginTop: '6px', fontSize: '12px', fontWeight: 800 }}>
                          Live OpenAQ AQI {area.liveAqi.aqi}
                        </div>
                      ) : null}
                    </div>
                    <div style={{ color: N.teal, fontWeight: 900 }}>{area.nexScore}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '18px', marginTop: '22px' }}>
        <div style={{ padding: '22px', borderRadius: '24px', background: N.bg, boxShadow: '8px 8px 16px #b8bec7, -8px -8px 16px #ffffff' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '18px' }}>Score Comparison</h2>
          <div style={{ height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <Radar dataKey={compared[0]?.name} stroke="#2a9d8f" fill="#2a9d8f" fillOpacity={0.25} />
                {compared[1] ? <Radar dataKey={compared[1].name} stroke="#e07b54" fill="#e07b54" fillOpacity={0.18} /> : null}
                {compared[2] ? <Radar dataKey={compared[2].name} stroke="#264653" fill="#264653" fillOpacity={0.15} /> : null}
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ padding: '22px', borderRadius: '24px', background: N.bg, boxShadow: '8px 8px 16px #b8bec7, -8px -8px 16px #ffffff' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '18px' }}>NexScore vs AQI</h2>
          <div style={{ height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonBars}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="nexScore" fill="#2a9d8f" radius={[8, 8, 0, 0]} />
                <Bar dataKey="averageAqi" fill="#e07b54" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginTop: '22px' }}>
        {compared.map((area) => (
          <div key={area.id} style={{ padding: '22px', borderRadius: '24px', background: N.bg, boxShadow: '8px 8px 16px #b8bec7, -8px -8px 16px #ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 900 }}>{area.name}</h3>
              <span style={{ color: N.teal, fontWeight: 800 }}>{area.confidence} confidence</span>
            </div>
            <p style={{ color: N.textLight, lineHeight: 1.6, marginTop: '10px' }}>{area.summary}</p>
            {area.liveAqi?.aqi ? (
              <div
                style={{
                  marginTop: '12px',
                  padding: '10px 12px',
                  borderRadius: '14px',
                  background: 'rgba(42,157,143,0.12)',
                  color: N.tealDark,
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                Live OpenAQ reading: AQI {area.liveAqi.aqi} from {area.liveAqi.locationName}
              </div>
            ) : null}
            <div style={{ height: 220, marginTop: '12px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={area.aqiTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#264653" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'grid', gap: '10px', marginTop: '16px' }}>
              <div><strong>Schools nearby:</strong> {area.metrics.schoolsNearby}</div>
              <div><strong>Average rent:</strong> Rs. {area.metrics.averageRent.toLocaleString('en-IN')}/month</div>
              <div><strong>Water:</strong> {area.utilities.waterSupply}</div>
              <div><strong>Upcoming:</strong> {area.infrastructureProjects.map((project) => project.title).join(', ')}</div>
            </div>

            {details[area.id]?.nearbyAmenities ? (
              <div style={{ marginTop: '18px' }}>
                <div style={{ fontSize: '15px', fontWeight: 900, color: N.tealDeep, marginBottom: '10px' }}>
                  Nearby real places within {details[area.id].nearbyAmenities.radiusMeters}m
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px', marginBottom: '12px' }}>
                  {[
                    ['schools', 'Schools'],
                    ['colleges', 'Colleges'],
                    ['hospitals', 'Hospitals'],
                    ['restaurants', 'Restaurants'],
                    ['banks', 'Banks'],
                    ['parks', 'Parks'],
                    ['shops', 'Shops'],
                  ].map(([key, label]) => (
                    <div
                      key={key}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '14px',
                        background: 'rgba(255,255,255,0.34)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '8px',
                      }}
                    >
                      <span>{label}</span>
                      <strong>{details[area.id].nearbyAmenities.summary?.[key] ?? 0}</strong>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gap: '8px' }}>
                  {(details[area.id].nearbyAmenities.categories?.schools || []).slice(0, 3).map((place) => (
                    <div key={place.id} style={{ padding: '10px 12px', borderRadius: '14px', boxShadow: 'inset 4px 4px 10px #b8bec7, inset -4px -4px 10px #ffffff' }}>
                      <strong>{place.name}</strong>
                    </div>
                  ))}
                  {(details[area.id].nearbyAmenities.categories?.hospitals || []).slice(0, 2).map((place) => (
                    <div key={place.id} style={{ padding: '10px 12px', borderRadius: '14px', boxShadow: 'inset 4px 4px 10px #b8bec7, inset -4px -4px 10px #ffffff' }}>
                      <strong>{place.name}</strong>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </AppShell>
  );
};

export default NeighborhoodPage;
