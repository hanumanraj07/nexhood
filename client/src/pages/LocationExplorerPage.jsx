import React, { useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import AppShell from '../components/AppShell';
import { neighborhoodService } from '../services/neighborhoodService';
import { extractErrorMessage } from '../services/api';
import { N } from '../styles/neumorphism';

const amenityConfig = [
  { key: 'schools', label: 'Schools' },
  { key: 'colleges', label: 'Colleges' },
  { key: 'hospitals', label: 'Hospitals' },
  { key: 'restaurants', label: 'Restaurants' },
  { key: 'banks', label: 'Banks' },
  { key: 'parks', label: 'Parks' },
  { key: 'shops', label: 'Shops' },
];

const cardStyle = {
  borderRadius: '20px',
  background: N.bg,
  boxShadow: '8px 8px 16px #b8bec7, -8px -8px 16px #ffffff',
};

const imageStyle = {
  width: '100%',
  aspectRatio: '16 / 10',
  objectFit: 'cover',
  borderRadius: '16px',
  background: '#dde2e9',
};

const currency = (value) =>
  Number(value || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  });

const placeholderStyle = {
  width: '100%',
  aspectRatio: '16 / 10',
  borderRadius: '16px',
  background: 'rgba(38,70,83,0.08)',
  color: N.textLight,
  display: 'grid',
  placeItems: 'center',
  fontWeight: 800,
  fontSize: '13px',
  textAlign: 'center',
  padding: '10px',
};

const LocationExplorerPage = () => {
  const [query, setQuery] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  React.useEffect(() => {
    const value = query.trim();
    if (value.length < 2) {
      setSuggestions([]);
      setSuggestLoading(false);
      return;
    }

    let cancelled = false;
    setSuggestLoading(true);

    const timeout = setTimeout(async () => {
      try {
        const next = await neighborhoodService.suggestLocations(value);
        if (!cancelled) {
          setSuggestions(next);
          setShowSuggestions(true);
        }
      } catch {
        if (!cancelled) {
          setSuggestions([]);
        }
      } finally {
        if (!cancelled) {
          setSuggestLoading(false);
        }
      }
    }, 280);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query]);

  const handleSearch = async (event) => {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError('Enter a location to search nearby properties and places.');
      return;
    }

    setLoading(true);
    setError('');
    setShowSuggestions(false);

    try {
      const response = await neighborhoodService.exploreLocation({
        query: trimmedQuery,
        lat: selectedSuggestion?.latitude,
        lng: selectedSuggestion?.longitude,
        radiusMeters: 3000,
      });
      setResult(response);
    } catch (err) {
      setError(extractErrorMessage(err));
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const amenitySections = useMemo(() => {
    const categories = result?.nearbyAmenities?.categories || {};
    return amenityConfig
      .map((item) => ({
        ...item,
        entries: categories[item.key] || [],
      }))
      .filter((item) => item.entries.length > 0);
  }, [result]);

  const mapCenter = result?.location?.coordinates
    ? [result.location.coordinates.lat, result.location.coordinates.lng]
    : [18.5642431, 73.7768573];

  const mapAmenities = useMemo(() => {
    const categories = result?.nearbyAmenities?.categories || {};
    return amenityConfig.flatMap((item) =>
      (categories[item.key] || []).slice(0, 16).map((entry) => ({
        ...entry,
        categoryLabel: item.label,
      }))
    );
  }, [result]);

  return (
    <AppShell
      title="Location Explorer"
      subtitle="Search any locality and discover available homes/flats plus nearby schools, colleges, hospitals, parks, and more."
    >
      <form
        onSubmit={handleSearch}
        style={{
          ...cardStyle,
          padding: '20px',
          marginBottom: '20px',
          display: 'grid',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ flex: '1 1 360px', position: 'relative' }}>
            <input
              type="text"
              value={query}
              onChange={(event) => {
                setSelectedSuggestion(null);
                setQuery(event.target.value);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search area, city, or landmark (e.g. Baner Pune)"
              style={{
                width: '100%',
                minHeight: '48px',
                borderRadius: '14px',
                padding: '0 14px',
                background: 'rgba(255,255,255,0.65)',
                boxShadow: 'inset 4px 4px 10px #b8bec7, inset -4px -4px 10px #ffffff',
              }}
            />
            {showSuggestions && (suggestions.length > 0 || suggestLoading) ? (
              <div
                style={{
                  position: 'absolute',
                  zIndex: 20,
                  top: '52px',
                  left: 0,
                  right: 0,
                  borderRadius: '12px',
                  background: N.bg,
                  boxShadow: '10px 10px 20px #b8bec7, -8px -8px 18px #ffffff',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  padding: '8px',
                }}
              >
                {suggestLoading ? (
                  <div style={{ padding: '10px 12px', color: N.textLight, fontWeight: 700 }}>Searching locations...</div>
                ) : null}
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedSuggestion(item);
                      setQuery(item.displayName);
                      setShowSuggestions(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      color: N.text,
                    }}
                  >
                    {item.displayName}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              minHeight: '48px',
              borderRadius: '14px',
              padding: '0 20px',
              background: N.teal,
              color: '#fff',
              fontWeight: 800,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'wait' : 'pointer',
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {result?.location ? (
          <div style={{ color: N.textLight, fontWeight: 700 }}>
            Showing results around: <span style={{ color: N.tealDeep }}>{result.location.displayName}</span>
          </div>
        ) : null}
        {selectedSuggestion ? (
          <div style={{ color: N.tealDeep, fontWeight: 700 }}>
            Exact point selected from suggestions for accurate nearby results.
          </div>
        ) : null}
        {error ? <div style={{ color: '#d64545', fontWeight: 700 }}>{error}</div> : null}
      </form>

      <section style={{ ...cardStyle, padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '14px' }}>Location Map</h2>
        <div style={{ height: 420, borderRadius: '16px', overflow: 'hidden' }}>
          <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {result?.location?.coordinates ? (
              <CircleMarker
                center={[result.location.coordinates.lat, result.location.coordinates.lng]}
                radius={10}
                pathOptions={{ color: '#264653', fillColor: '#2a9d8f', fillOpacity: 1 }}
              >
                <Popup>
                  <strong>Searched Location</strong>
                  <br />
                  {result.location.displayName}
                </Popup>
              </CircleMarker>
            ) : null}

            {(result?.properties || []).map((property) => (
              <CircleMarker
                key={property.id}
                center={[property.coordinates.lat, property.coordinates.lng]}
                radius={7}
                pathOptions={{ color: '#14532d', fillColor: '#22c55e', fillOpacity: 0.9 }}
              >
                <Popup>
                  <strong>{property.name}</strong>
                  <br />
                  {property.type} • {property.beds} BHK
                  <br />
                  Rs. {currency(property.priceEstimate)}
                </Popup>
              </CircleMarker>
            ))}

            {mapAmenities.map((place) => (
              <CircleMarker
                key={`${place.categoryLabel}-${place.id}`}
                center={[place.lat, place.lng]}
                radius={5}
                pathOptions={{ color: '#7c2d12', fillColor: '#f97316', fillOpacity: 0.85 }}
              >
                <Popup>
                  <strong>{place.name}</strong>
                  <br />
                  {place.categoryLabel}
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </section>

      <section style={{ ...cardStyle, padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '14px' }}>Available Flats & Homes</h2>
        {result?.properties?.length ? null : result?.location ? (
          <div style={{ marginBottom: '12px', color: N.textLight, fontWeight: 700 }}>
            No verified property records were found in this radius right now.
          </div>
        ) : null}
        {result && !result?.properties?.length && result?.nearbyAmenities?.unavailable ? (
          <div style={{ marginBottom: '12px', color: '#b26a00', fontWeight: 700 }}>
            Real-time providers are temporarily unavailable. Try again in a moment.
          </div>
        ) : null}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          {(result?.properties || []).map((property) => (
            <article
              key={property.id}
              style={{
                borderRadius: '16px',
                padding: '12px',
                background: 'rgba(255,255,255,0.45)',
                boxShadow: 'inset 4px 4px 10px #b8bec7, inset -4px -4px 10px #ffffff',
              }}
            >
              {property.image ? (
                <img src={property.image} alt={property.name} style={imageStyle} />
              ) : (
                <div style={placeholderStyle}>No verified image for this listing</div>
              )}
              <h3 style={{ marginTop: '10px', fontSize: '17px', fontWeight: 900 }}>{property.name}</h3>
              <div style={{ marginTop: '6px', color: N.textLight, fontWeight: 700 }}>
                {property.type} • {property.beds} BHK • {property.areaSqFt} sq.ft
              </div>
              <div style={{ marginTop: '8px', color: N.teal, fontWeight: 900 }}>
                Estimated price: Rs. {currency(property.priceEstimate)}
              </div>
            </article>
          ))}
        </div>
        {!loading && result && !result?.properties?.length ? (
          <p style={{ marginTop: '10px', color: N.textLight }}>No mapped residential properties were found in this radius.</p>
        ) : null}
      </section>

      <section style={{ ...cardStyle, padding: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '14px' }}>Nearby Schools, Colleges, Hospitals & More</h2>
        {result?.nearbyAmenities?.unavailable ? (
          <div style={{ marginBottom: '12px', color: '#b26a00', fontWeight: 700 }}>
            Nearby places API is temporarily unavailable. Showing only confirmed data when available.
          </div>
        ) : null}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          {amenityConfig.map((item) => (
            <div
              key={item.key}
              style={{
                borderRadius: '14px',
                padding: '10px 12px',
                background: 'rgba(255,255,255,0.45)',
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 800,
              }}
            >
              <span>{item.label}</span>
              <span>{result?.nearbyAmenities?.summary?.[item.key] ?? 0}</span>
            </div>
          ))}
        </div>

        {amenitySections.map((section) => (
          <div key={section.key} style={{ marginTop: '16px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 900, marginBottom: '10px' }}>{section.label}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              {section.entries.slice(0, 8).map((place) => (
                <article
                  key={`${section.key}-${place.id}`}
                  style={{
                    borderRadius: '16px',
                    padding: '10px',
                    background: 'rgba(255,255,255,0.45)',
                    boxShadow: 'inset 4px 4px 10px #b8bec7, inset -4px -4px 10px #ffffff',
                  }}
                >
                  {place.image ? (
                    <img src={place.image} alt={place.name} style={imageStyle} />
                  ) : (
                    <div style={placeholderStyle}>No verified image for this place</div>
                  )}
                  <div style={{ marginTop: '8px', fontWeight: 800 }}>{place.name}</div>
                </article>
              ))}
            </div>
          </div>
        ))}

        {!loading && result && !amenitySections.length ? (
          <p style={{ marginTop: '10px', color: N.textLight }}>Nearby points of interest could not be fetched for this location.</p>
        ) : null}
      </section>
    </AppShell>
  );
};

export default LocationExplorerPage;
