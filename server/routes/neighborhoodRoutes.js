const express = require('express');
const { readDb } = require('../data/store');
const { attachLiveAqi, attachLiveAqiToMany } = require('../utils/openaq');
const { getNearbyAmenities, getNearbyProperties } = require('../utils/overpass');
const { geocodeLocation, suggestLocations } = require('../utils/geocode');

const router = express.Router();

router.get('/', async (_req, res) => {
  const db = await readDb();
  const neighborhoods = await attachLiveAqiToMany(db.neighborhoods);
  res.json({
    success: true,
    neighborhoods,
  });
});

router.post('/compare', async (req, res) => {
  const localityIds = Array.isArray(req.body?.localityIds)
    ? req.body.localityIds
    : Array.isArray(req.body?.locality_ids)
      ? req.body.locality_ids
      : [];
  const db = await readDb();
  const neighborhoods = await attachLiveAqiToMany(
    db.neighborhoods.filter((entry) => localityIds.includes(entry.id))
  );

  res.json({
    success: true,
    neighborhoods,
  });
});

router.get('/suggest', async (req, res) => {
  const query = String(req.query.query || '').trim();
  if (query.length < 2) {
    return res.json({ success: true, suggestions: [] });
  }

  try {
    const suggestions = await suggestLocations(query);
    return res.json({
      success: true,
      suggestions,
    });
  } catch (error) {
    return res.status(502).json({
      success: false,
      message: `Location suggestion lookup failed: ${error.message}`,
    });
  }
});

router.get('/explore', async (req, res) => {
  const query = String(req.query.query || '').trim();
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const hasCoordinates = Number.isFinite(lat) && Number.isFinite(lng);
  const radiusMeters = Math.max(1000, Math.min(8000, Number(req.query.radiusMeters) || 3000));

  let location;

  if (hasCoordinates) {
    location = {
      displayName: query || 'Custom location',
      latitude: lat,
      longitude: lng,
    };
  } else if (query) {
    try {
      location = await geocodeLocation(query);
    } catch (error) {
      return res.status(502).json({
        success: false,
        message: `Location lookup failed: ${error.message}`,
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: 'Provide a location query or valid lat/lng.',
    });
  }

  if (!location) {
    const db = await readDb();
    const fallbackNeighborhood = db.neighborhoods.find((entry) =>
      query ? entry.name.toLowerCase().includes(query.toLowerCase()) : false
    );

    if (fallbackNeighborhood) {
      location = {
        displayName: `${fallbackNeighborhood.name}, ${fallbackNeighborhood.city}`,
        latitude: fallbackNeighborhood.coordinates.lat,
        longitude: fallbackNeighborhood.coordinates.lng,
      };
    }
  }

  if (!location) {
    return res.status(404).json({
      success: false,
      message: 'Location not found. Try a nearby city or locality name.',
    });
  }

  const [amenities, propertyData] = await Promise.all([
    getNearbyAmenities({
      latitude: location.latitude,
      longitude: location.longitude,
      areaHint: location.displayName,
    }),
    getNearbyProperties({
      latitude: location.latitude,
      longitude: location.longitude,
      radiusMeters,
      areaHint: location.displayName,
    }),
  ]);

  res.json({
    success: true,
    location: {
      query,
      displayName: location.displayName,
      coordinates: {
        lat: location.latitude,
        lng: location.longitude,
      },
      radiusMeters,
    },
    properties: propertyData.properties,
    nearbyAmenities: amenities,
  });
});

router.get('/:id', async (req, res) => {
  const db = await readDb();
  const neighborhood = db.neighborhoods.find((entry) => entry.id === req.params.id);

  if (!neighborhood) {
    return res.status(404).json({ success: false, message: 'Neighborhood not found.' });
  }

  const enrichedNeighborhood = await attachLiveAqi(neighborhood);
  const nearbyAmenities = await getNearbyAmenities({
    latitude: enrichedNeighborhood.coordinates.lat,
    longitude: enrichedNeighborhood.coordinates.lng,
    areaHint: `${enrichedNeighborhood.name}, ${enrichedNeighborhood.city}`,
  });

  res.json({
    success: true,
    neighborhood: {
      ...enrichedNeighborhood,
      nearbyAmenities,
    },
  });
});

module.exports = router;
