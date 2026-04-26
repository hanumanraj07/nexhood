const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

const buildUserAgentHeaders = () => ({
  'User-Agent': 'NexHood/1.0 (local development)',
});

const geocodeLocation = async (query) => {
  const value = String(query || '').trim();
  if (!value) {
    return null;
  }

  const params = new URLSearchParams({
    q: value,
    format: 'jsonv2',
    limit: '1',
    addressdetails: '1',
  });

  const response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
    headers: buildUserAgentHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Geocoding failed with status ${response.status}`);
  }

  const results = await response.json();
  if (!Array.isArray(results) || !results.length) {
    return null;
  }

  const top = results[0];
  return {
    displayName: top.display_name,
    latitude: Number(top.lat),
    longitude: Number(top.lon),
  };
};

const suggestLocations = async (query) => {
  const value = String(query || '').trim();
  if (value.length < 2) {
    return [];
  }

  const params = new URLSearchParams({
    q: value,
    format: 'jsonv2',
    limit: '6',
    addressdetails: '1',
  });

  const response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
    headers: buildUserAgentHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Suggestion lookup failed with status ${response.status}`);
  }

  const results = await response.json();
  if (!Array.isArray(results)) {
    return [];
  }

  return results.map((entry) => ({
    id: entry.place_id,
    displayName: entry.display_name,
    latitude: Number(entry.lat),
    longitude: Number(entry.lon),
  }));
};

module.exports = {
  geocodeLocation,
  suggestLocations,
};
