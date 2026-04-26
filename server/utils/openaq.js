const OPENAQ_BASE_URL = 'https://api.openaq.org/v3';
const INDIA_COUNTRY_ID = 9;
const CACHE_TTL_MS = 30 * 60 * 1000;

const cache = new Map();
const RECENT_DATA_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

const buildHeaders = () => {
  const apiKey = process.env.OPENAQ_API_KEY;
  if (!apiKey) {
    return null;
  }

  return {
    'X-API-Key': apiKey,
  };
};

const pm25ToAqi = (pm25) => {
  if (pm25 == null || Number.isNaN(Number(pm25))) {
    return null;
  }

  const concentration = Number(pm25);
  const breakpoints = [
    { cLow: 0.0, cHigh: 12.0, aLow: 0, aHigh: 50 },
    { cLow: 12.1, cHigh: 35.4, aLow: 51, aHigh: 100 },
    { cLow: 35.5, cHigh: 55.4, aLow: 101, aHigh: 150 },
    { cLow: 55.5, cHigh: 150.4, aLow: 151, aHigh: 200 },
    { cLow: 150.5, cHigh: 250.4, aLow: 201, aHigh: 300 },
    { cLow: 250.5, cHigh: 350.4, aLow: 301, aHigh: 400 },
    { cLow: 350.5, cHigh: 500.4, aLow: 401, aHigh: 500 },
  ];

  const band = breakpoints.find((entry) => concentration >= entry.cLow && concentration <= entry.cHigh);
  if (!band) {
    return concentration > 500.4 ? 500 : null;
  }

  return Math.round(
    ((band.aHigh - band.aLow) / (band.cHigh - band.cLow)) * (concentration - band.cLow) + band.aLow
  );
};

const getCacheKey = ({ latitude, longitude }) => `${latitude.toFixed(3)}:${longitude.toFixed(3)}`;

const fetchJson = async (url) => {
  const headers = buildHeaders();
  if (!headers) {
    return null;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`OpenAQ request failed with status ${response.status}`);
  }

  return response.json();
};

const findNearestPm25Sensor = async ({ latitude, longitude }) => {
  const query = new URLSearchParams({
    country_id: String(INDIA_COUNTRY_ID),
    coordinates: `${latitude},${longitude}`,
    radius: '20000',
    limit: '8',
    order_by: 'distance',
    sort: 'asc',
  });

  const payload = await fetchJson(`${OPENAQ_BASE_URL}/locations?${query.toString()}`);
  const locations = payload?.results || [];

  const withPm25 = locations
    .map((location) => ({
      location,
      sensor: (location.sensors || []).find((entry) => entry.parameter?.name === 'pm25'),
    }))
    .filter((entry) => entry.sensor);

  const recentCandidates = withPm25.filter((entry) => {
    const lastUtc = entry.location?.datetimeLast?.utc;
    if (!lastUtc) return false;
    return Date.now() - new Date(lastUtc).getTime() <= RECENT_DATA_WINDOW_MS;
  });

  const candidates = recentCandidates.length ? recentCandidates : withPm25;

  for (const entry of candidates) {
    return {
      locationId: entry.location.id,
      locationName: entry.location.name,
      locality: entry.location.locality || entry.location.name,
      distance: entry.location.distance,
      sensorId: entry.sensor.id,
      lastUtc: entry.location?.datetimeLast?.utc || null,
    };
  }

  return null;
};

const fetchSensorLatest = async (sensorId) => {
  const payload = await fetchJson(`${OPENAQ_BASE_URL}/sensors/${sensorId}`);
  return payload?.results?.[0] || null;
};

const getLiveAqiForCoordinates = async ({ latitude, longitude }) => {
  const headers = buildHeaders();
  if (!headers) {
    return null;
  }

  const cacheKey = getCacheKey({ latitude, longitude });
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  try {
    const nearestSensor = await findNearestPm25Sensor({ latitude, longitude });
    if (!nearestSensor) {
      cache.set(cacheKey, { value: null, expiresAt: Date.now() + CACHE_TTL_MS });
      return null;
    }

    const latestSensor = await fetchSensorLatest(nearestSensor.sensorId);
    const pm25 = latestSensor?.latest?.value ?? null;
    const liveAqi = pm25ToAqi(pm25);

    const value = {
      source: 'OpenAQ',
      parameter: 'pm25',
      pm25,
      aqi: liveAqi,
      measuredAtUtc: latestSensor?.latest?.datetime?.utc || latestSensor?.datetimeLast?.utc || null,
      locationId: nearestSensor.locationId,
      locationName: nearestSensor.locationName,
      locality: nearestSensor.locality,
      distanceMeters: nearestSensor.distance,
    };

    cache.set(cacheKey, { value, expiresAt: Date.now() + CACHE_TTL_MS });
    return value;
  } catch (error) {
    cache.set(cacheKey, { value: null, expiresAt: Date.now() + 5 * 60 * 1000 });
    return null;
  }
};

const attachLiveAqi = async (neighborhood) => {
  const coordinates = neighborhood?.coordinates;
  if (!coordinates?.lat || !coordinates?.lng) {
    return neighborhood;
  }

  const liveAqi = await getLiveAqiForCoordinates({
    latitude: coordinates.lat,
    longitude: coordinates.lng,
  });

  if (!liveAqi?.aqi) {
    return neighborhood;
  }

  return {
    ...neighborhood,
    liveAqi,
    metrics: {
      ...neighborhood.metrics,
      averageAqi: liveAqi.aqi,
      livePm25: liveAqi.pm25,
    },
  };
};

const attachLiveAqiToMany = async (neighborhoods) => Promise.all(neighborhoods.map(attachLiveAqi));

module.exports = {
  attachLiveAqi,
  attachLiveAqiToMany,
  getLiveAqiForCoordinates,
  pm25ToAqi,
};
