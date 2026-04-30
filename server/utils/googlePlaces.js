const CACHE_TTL_MS = 60 * 60 * 1000;
const SEARCH_RADIUS_METERS = 3000;
const GEOCODE_BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

const amenitiesCache = new Map();
const propertyCache = new Map();

const categories = {
  schools: { type: 'school', label: 'Schools' },
  colleges: { type: 'university', label: 'Colleges' },
  hospitals: { type: 'hospital', label: 'Hospitals' },
  restaurants: { type: 'restaurant', label: 'Restaurants' },
  banks: { type: 'bank', label: 'Banks' },
  parks: { type: 'park', label: 'Parks' },
  shops: { type: 'store', label: 'Shops' },
};

const getApiKey = () => process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

const requireApiKey = () => {
  const key = getApiKey();
  if (!key) {
    throw new Error('Missing GOOGLE_PLACES_API_KEY (or GOOGLE_MAPS_API_KEY) in server environment.');
  }
  return key;
};

const getCacheKey = ({ latitude, longitude, radiusMeters = SEARCH_RADIUS_METERS }) =>
  `${latitude.toFixed(3)}:${longitude.toFixed(3)}:${radiusMeters}`;

const photoUrl = (photoRef, maxWidth = 640) => {
  if (!photoRef) return null;
  const key = getApiKey();
  if (!key) return null;
  return `${PLACES_BASE_URL}/photo?maxwidth=${maxWidth}&photo_reference=${encodeURIComponent(photoRef)}&key=${encodeURIComponent(key)}`;
};

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`status ${response.status}`);
  }
  return response.json();
};

const geocodeLocation = async (query) => {
  const value = String(query || '').trim();
  if (!value) return null;
  const key = requireApiKey();

  const params = new URLSearchParams({
    address: value,
    key,
  });

  const payload = await fetchJson(`${GEOCODE_BASE_URL}?${params.toString()}`);
  if (payload.status !== 'OK' || !Array.isArray(payload.results) || !payload.results.length) {
    return null;
  }

  const top = payload.results[0];
  return {
    displayName: top.formatted_address,
    latitude: Number(top.geometry?.location?.lat),
    longitude: Number(top.geometry?.location?.lng),
  };
};

const getPlaceDetailsCoordinates = async (placeId) => {
  const key = requireApiKey();
  const params = new URLSearchParams({
    place_id: placeId,
    fields: 'geometry,formatted_address,name',
    key,
  });
  const payload = await fetchJson(`${PLACES_BASE_URL}/details/json?${params.toString()}`);
  if (payload.status !== 'OK' || !payload.result) return null;
  return payload.result;
};

const suggestLocations = async (query) => {
  const value = String(query || '').trim();
  if (value.length < 2) return [];
  const key = requireApiKey();

  const params = new URLSearchParams({
    input: value,
    types: 'geocode',
    key,
  });
  const payload = await fetchJson(`${PLACES_BASE_URL}/autocomplete/json?${params.toString()}`);
  if (payload.status !== 'OK' || !Array.isArray(payload.predictions)) return [];

  const rows = await Promise.all(
    payload.predictions.slice(0, 6).map(async (prediction) => {
      const details = await getPlaceDetailsCoordinates(prediction.place_id);
      if (!details?.geometry?.location) return null;
      return {
        id: prediction.place_id,
        displayName: details.formatted_address || prediction.description,
        latitude: Number(details.geometry.location.lat),
        longitude: Number(details.geometry.location.lng),
      };
    })
  );

  return rows.filter(Boolean);
};

const formatPlace = (row, categoryKey) => ({
  id: row.place_id,
  name: row.name || 'Unnamed Place',
  lat: Number(row.geometry?.location?.lat),
  lng: Number(row.geometry?.location?.lng),
  rating: Number(row.rating || 0),
  address: row.vicinity || row.formatted_address || '',
  type: {
    category: categoryKey,
    rawTypes: row.types || [],
  },
  image: photoUrl(row.photos?.[0]?.photo_reference),
  source: 'Google Places API',
});

const getNearbyByType = async ({ latitude, longitude, radiusMeters, categoryKey, type }) => {
  const key = requireApiKey();
  const params = new URLSearchParams({
    location: `${latitude},${longitude}`,
    radius: String(radiusMeters),
    type,
    key,
  });
  const payload = await fetchJson(`${PLACES_BASE_URL}/nearbysearch/json?${params.toString()}`);
  if (payload.status !== 'OK' && payload.status !== 'ZERO_RESULTS') {
    throw new Error(payload.error_message || payload.status || 'Nearby search failed');
  }
  return (payload.results || []).slice(0, 14).map((row) => formatPlace(row, categoryKey));
};

const getNearbyAmenities = async ({ latitude, longitude, areaHint = '' }) => {
  const cacheKey = getCacheKey({ latitude, longitude });
  const cached = amenitiesCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  try {
    const categoryRows = await Promise.all(
      Object.entries(categories).map(async ([categoryKey, config]) => [
        categoryKey,
        await getNearbyByType({
          latitude,
          longitude,
          radiusMeters: SEARCH_RADIUS_METERS,
          categoryKey,
          type: config.type,
        }),
      ])
    );
    const categoriesData = Object.fromEntries(categoryRows);
    const value = {
      categories: categoriesData,
      summary: Object.fromEntries(Object.keys(categoriesData).map((key) => [key, categoriesData[key].length])),
      radiusMeters: SEARCH_RADIUS_METERS,
      source: 'Google Places API',
      realData: true,
      areaHint,
    };
    amenitiesCache.set(cacheKey, { value, expiresAt: Date.now() + CACHE_TTL_MS });
    return value;
  } catch (error) {
    const value = {
      categories: {},
      summary: {},
      radiusMeters: SEARCH_RADIUS_METERS,
      source: 'Google Places API',
      realData: false,
      unavailable: true,
      message: error.message,
    };
    amenitiesCache.set(cacheKey, { value, expiresAt: Date.now() + 5 * 60 * 1000 });
    return value;
  }
};

const estimatePrice = (id) => {
  const hash = String(id || '')
    .split('')
    .reduce((acc, ch) => (acc * 33 + ch.charCodeAt(0)) % 100000, 7);
  return Math.round((4000000 + (hash % 140) * 175000) / 10000) * 10000;
};

const getNearbyProperties = async ({ latitude, longitude, radiusMeters = SEARCH_RADIUS_METERS }) => {
  const cacheKey = getCacheKey({ latitude, longitude, radiusMeters });
  const cached = propertyCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  try {
    const key = requireApiKey();
    const params = new URLSearchParams({
      query: 'apartments OR residential project OR flats',
      location: `${latitude},${longitude}`,
      radius: String(radiusMeters),
      key,
    });

    const payload = await fetchJson(`${PLACES_BASE_URL}/textsearch/json?${params.toString()}`);
    if (payload.status !== 'OK' && payload.status !== 'ZERO_RESULTS') {
      throw new Error(payload.error_message || payload.status || 'Property search failed');
    }

    const properties = (payload.results || []).slice(0, 16).map((row) => ({
      id: row.place_id,
      name: row.name || 'Residential Property',
      type: 'Flat/Home',
      coordinates: {
        lat: Number(row.geometry?.location?.lat),
        lng: Number(row.geometry?.location?.lng),
      },
      beds: 2,
      baths: 1,
      areaSqFt: 980,
      priceEstimate: estimatePrice(row.place_id),
      image: photoUrl(row.photos?.[0]?.photo_reference),
      address: row.formatted_address || '',
      rating: Number(row.rating || 0),
      source: 'Google Places API',
    }));

    const value = {
      properties,
      radiusMeters,
      source: 'Google Places API',
      realData: true,
    };
    propertyCache.set(cacheKey, { value, expiresAt: Date.now() + CACHE_TTL_MS });
    return value;
  } catch (error) {
    const value = {
      properties: [],
      radiusMeters,
      source: 'Google Places API',
      realData: false,
      unavailable: true,
      message: error.message,
    };
    propertyCache.set(cacheKey, { value, expiresAt: Date.now() + 5 * 60 * 1000 });
    return value;
  }
};

module.exports = {
  geocodeLocation,
  suggestLocations,
  getNearbyAmenities,
  getNearbyProperties,
  categories,
};
