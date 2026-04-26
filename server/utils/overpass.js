const CACHE_TTL_MS = 60 * 60 * 1000;
const SEARCH_RADIUS_METERS = 3000;

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.fr/api/interpreter',
];

const amenitiesCache = new Map();
const propertyCache = new Map();
const imagePoolCache = new Map();
const placeImageCache = new Map();

const categories = {
  schools: { tag: 'amenity', value: 'school', label: 'Schools' },
  colleges: { tag: 'amenity', value: 'university', label: 'Colleges' },
  hospitals: { tag: 'amenity', value: 'hospital', label: 'Hospitals' },
  restaurants: { tag: 'amenity', value: 'restaurant', label: 'Restaurants' },
  banks: { tag: 'amenity', value: 'bank', label: 'Banks' },
  parks: { tag: 'leisure', value: 'park', label: 'Parks' },
  shops: { tag: 'shop', value: null, label: 'Shops' },
};

const getCacheKey = ({ latitude, longitude, radiusMeters = SEARCH_RADIUS_METERS }) =>
  `${latitude.toFixed(3)}:${longitude.toFixed(3)}:${radiusMeters}`;

const withTimeout = async (promiseFactory, timeoutMs = 12000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await promiseFactory(controller.signal);
  } finally {
    clearTimeout(timer);
  }
};

const defaultHeaders = {
  'User-Agent': 'NexHood/1.0 (+https://nexhood.local)',
  Accept: 'application/json,text/plain,*/*',
};

const fetchOverpass = async (query) => {
  let lastError = null;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const response = await withTimeout(
        (signal) =>
          fetch(endpoint, {
            method: 'POST',
            headers: { ...defaultHeaders, 'Content-Type': 'text/plain' },
            body: query,
            signal,
          }),
        14000
      );

      if (!response.ok) {
        throw new Error(`status ${response.status}`);
      }

      const payload = await response.json();
      return payload.elements || [];
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(`All Overpass endpoints failed. ${lastError?.message || ''}`.trim());
};

const commonsImageUrl = (commonsValue) => {
  const raw = String(commonsValue || '').trim();
  if (!raw) return null;

  const fileName = raw.replace(/^File:/i, '').replace(/ /g, '_');
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=640`;
};

const bestTagImage = (tags = {}) => {
  if (typeof tags.image === 'string' && /^https?:\/\//i.test(tags.image)) {
    return tags.image;
  }
  if (typeof tags.wikimedia_commons === 'string') {
    return commonsImageUrl(tags.wikimedia_commons);
  }
  return null;
};

const getImagePoolKey = (lat, lng) => `${lat.toFixed(3)}:${lng.toFixed(3)}`;

const fetchWikimediaImagePool = async (lat, lng) => {
  const cacheKey = getImagePoolKey(lat, lng);
  const cached = imagePoolCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  try {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      generator: 'geosearch',
      ggscoord: `${lat}|${lng}`,
      ggsradius: '2000',
      ggslimit: '40',
      prop: 'pageimages',
      piprop: 'thumbnail',
      pithumbsize: '640',
      origin: '*',
    });

    const url = `https://commons.wikimedia.org/w/api.php?${params.toString()}`;
    const response = await withTimeout((signal) => fetch(url, { signal, headers: defaultHeaders }), 12000);
    if (!response.ok) {
      throw new Error(`status ${response.status}`);
    }

    const payload = await response.json();
    const pages = payload?.query?.pages ? Object.values(payload.query.pages) : [];
    const urls = pages
      .map((page) => page?.thumbnail?.source)
      .filter((item) => typeof item === 'string' && item.length > 0);

    imagePoolCache.set(cacheKey, {
      value: urls,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return urls;
  } catch {
    imagePoolCache.set(cacheKey, {
      value: [],
      expiresAt: Date.now() + 10 * 60 * 1000,
    });
    return [];
  }
};

const sanitizeText = (value) => String(value || '').replace(/[^\w\s-]/g, ' ').replace(/\s+/g, ' ').trim();

const fetchWikimediaImageBySearch = async ({ name, categoryKey, areaHint }) => {
  const cleanName = sanitizeText(name);
  if (!cleanName || cleanName.toLowerCase().includes('unnamed')) {
    return null;
  }

  const cacheKey = `${cleanName.toLowerCase()}|${categoryKey}|${String(areaHint || '').toLowerCase()}`;
  const cached = placeImageCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const categoryWords = {
    schools: 'school campus',
    colleges: 'university college',
    hospitals: 'hospital building',
    restaurants: 'restaurant',
    banks: 'bank branch',
    parks: 'park',
    shops: 'shop storefront',
  };

  const searchText = [cleanName, sanitizeText(areaHint), categoryWords[categoryKey] || 'building']
    .filter(Boolean)
    .join(' ');

  try {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      generator: 'search',
      gsrsearch: searchText,
      gsrlimit: '5',
      gsrnamespace: '6',
      prop: 'imageinfo',
      iiprop: 'url',
      iiurlwidth: '640',
      origin: '*',
    });

    const url = `https://commons.wikimedia.org/w/api.php?${params.toString()}`;
    const response = await withTimeout((signal) => fetch(url, { signal, headers: defaultHeaders }), 10000);
    if (!response.ok) {
      throw new Error(`status ${response.status}`);
    }

    const payload = await response.json();
    const pages = payload?.query?.pages ? Object.values(payload.query.pages) : [];
    const image =
      pages.find((page) => page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url)?.imageinfo?.[0]
        ?.thumburl ||
      pages.find((page) => page?.imageinfo?.[0]?.url)?.imageinfo?.[0]?.url ||
      null;

    placeImageCache.set(cacheKey, {
      value: image,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });
    return image;
  } catch {
    placeImageCache.set(cacheKey, {
      value: null,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });
    return null;
  }
};

const enrichEntriesWithRealImages = async ({ entries, categoryKey, areaHint }) => {
  const target = entries.slice(0, 12);
  const lookups = target.map(async (entry) => {
    if (entry.image) return entry;
    const image = await fetchWikimediaImageBySearch({
      name: entry.name,
      categoryKey,
      areaHint,
    });
    return { ...entry, image: image || null };
  });
  return Promise.all(lookups);
};

const formatAmenities = ({ elements = [], categoryKey }) =>
  elements.slice(0, 14).map((element) => {
    const tagImage = bestTagImage(element.tags);
    const image = tagImage || null;
    return {
      id: element.id,
      name: element.tags?.name || 'Unnamed Place',
      lat: element.lat,
      lng: element.lon,
      type: element.tags || {},
      image: image || null,
    };
  });

const detectCategoryKey = (tags = {}) => {
  if (tags.amenity === 'school') return 'schools';
  if (tags.amenity === 'university') return 'colleges';
  if (tags.amenity === 'hospital') return 'hospitals';
  if (tags.amenity === 'restaurant') return 'restaurants';
  if (tags.amenity === 'bank') return 'banks';
  if (tags.leisure === 'park') return 'parks';
  if (tags.shop) return 'shops';
  return null;
};

const buildAmenitiesCombinedQuery = (lat, lng, radiusMeters = SEARCH_RADIUS_METERS) => `
  [out:json][timeout:25];
  (
    node["amenity"="school"](around:${radiusMeters},${lat},${lng});
    node["amenity"="university"](around:${radiusMeters},${lat},${lng});
    node["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
    node["amenity"="restaurant"](around:${radiusMeters},${lat},${lng});
    node["amenity"="bank"](around:${radiusMeters},${lat},${lng});
    node["leisure"="park"](around:${radiusMeters},${lat},${lng});
    node["shop"](around:${radiusMeters},${lat},${lng});
  );
  out;
`;

const getAllNearbyAmenities = async (lat, lng, areaHint) => {
  const grouped = Object.fromEntries(Object.keys(categories).map((key) => [key, []]));
  const query = buildAmenitiesCombinedQuery(lat, lng, SEARCH_RADIUS_METERS);
  const elements = await fetchOverpass(query);

  for (const element of elements) {
    const key = detectCategoryKey(element.tags);
    if (!key) continue;
    grouped[key].push(element);
  }

  const formatted = Object.fromEntries(
    Object.entries(grouped).map(([key, rows]) => [key, formatAmenities({ elements: rows, categoryKey: key })])
  );

  const keys = Object.keys(formatted);
  const enrichedPairs = await Promise.all(
    keys.map(async (key) => [
      key,
      await enrichEntriesWithRealImages({
        entries: formatted[key],
        categoryKey: key,
        areaHint,
      }),
    ])
  );

  return Object.fromEntries(enrichedPairs);
};

const propertyTypeLabel = (buildingTag) => {
  const value = String(buildingTag || '').toLowerCase();
  if (value === 'apartments') return 'Flat';
  if (value === 'house' || value === 'detached') return 'House';
  if (value === 'residential') return 'Home';
  return 'Property';
};

const bedsFromTag = (roomsTag) => {
  const numeric = Number(roomsTag);
  if (Number.isFinite(numeric)) {
    return Math.max(1, Math.min(6, Math.round(numeric)));
  }
  return null;
};

const priceEstimate = (id) => {
  const hash = String(id || '')
    .split('')
    .reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 100000, 11);
  const base = 3500000 + (hash % 120) * 180000;
  return Math.round(base / 10000) * 10000;
};

const buildPropertyQuery = (lat, lng, radiusMeters) => `
  [out:json][timeout:25];
  (
    nwr["building"="apartments"](around:${radiusMeters},${lat},${lng});
    nwr["building"="house"](around:${radiusMeters},${lat},${lng});
    nwr["building"="residential"](around:${radiusMeters},${lat},${lng});
    nwr["building"="detached"](around:${radiusMeters},${lat},${lng});
  );
  out center tags;
`;

const formatProperties = ({ elements = [] }) => {
  const rows = [];
  const seen = new Set();

  for (const element of elements) {
    const lat = element.lat ?? element.center?.lat;
    const lng = element.lon ?? element.center?.lon;
    if (typeof lat !== 'number' || typeof lng !== 'number') continue;

    const id = `${element.type}-${element.id}`;
    if (seen.has(id)) continue;
    seen.add(id);

    const type = propertyTypeLabel(element.tags?.building);
    const beds = bedsFromTag(element.tags?.rooms);
    const area = Number(element.tags?.['building:levels'])
      ? 650 + Math.min(8, Number(element.tags?.['building:levels'])) * 180
      : null;
    const image = bestTagImage(element.tags) || null;

    rows.push({
      id,
      name: element.tags?.name || `${type} near selected location`,
      type,
      coordinates: { lat, lng },
      beds: beds || 2,
      baths: Math.max(1, (beds || 2) - 1),
      areaSqFt: area || 980,
      priceEstimate: priceEstimate(id),
      image: image || null,
      source: 'OpenStreetMap Overpass',
    });

    if (rows.length >= 18) break;
  }

  return rows;
};

const getNearbyAmenities = async ({ latitude, longitude, areaHint = '' }) => {
  const cacheKey = getCacheKey({ latitude, longitude });
  const cached = amenitiesCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  await fetchWikimediaImagePool(latitude, longitude);

  try {
    const categoriesData = await getAllNearbyAmenities(latitude, longitude, areaHint);
    const value = {
      categories: categoriesData,
      summary: Object.fromEntries(
        Object.entries(categoriesData).map(([key, entries]) => [key, entries.length])
      ),
      radiusMeters: SEARCH_RADIUS_METERS,
      source: 'OpenStreetMap Overpass',
      realData: true,
      imageSource: 'OSM tags + Wikimedia Commons',
    };

    amenitiesCache.set(cacheKey, { value, expiresAt: Date.now() + CACHE_TTL_MS });
    return value;
  } catch (error) {
    const value = {
      categories: {},
      summary: {},
      radiusMeters: SEARCH_RADIUS_METERS,
      source: 'OpenStreetMap Overpass',
      realData: false,
      unavailable: true,
      message: error.message,
    };
    amenitiesCache.set(cacheKey, { value, expiresAt: Date.now() + 5 * 60 * 1000 });
    return value;
  }
};

const getNearbyProperties = async ({ latitude, longitude, radiusMeters = SEARCH_RADIUS_METERS }) => {
  const cacheKey = getCacheKey({ latitude, longitude, radiusMeters });
  const cached = propertyCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  await fetchWikimediaImagePool(latitude, longitude);

  try {
    const query = buildPropertyQuery(latitude, longitude, radiusMeters);
    const elements = await fetchOverpass(query);
    const properties = formatProperties({ elements });
    const value = {
      properties,
      radiusMeters,
      source: 'OpenStreetMap Overpass',
      realData: true,
      imageSource: 'OSM tags + Wikimedia Commons',
    };
    propertyCache.set(cacheKey, { value, expiresAt: Date.now() + CACHE_TTL_MS });
    return value;
  } catch (error) {
    const value = {
      properties: [],
      radiusMeters,
      source: 'OpenStreetMap Overpass',
      realData: false,
      unavailable: true,
      message: error.message,
    };
    propertyCache.set(cacheKey, { value, expiresAt: Date.now() + 5 * 60 * 1000 });
    return value;
  }
};

module.exports = {
  getNearbyAmenities,
  getNearbyProperties,
  categories,
};
