const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const neighborhoodRoutes = require('./routes/neighborhoodRoutes');
const parkingRoutes = require('./routes/parkingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const intelligenceRoutes = require('./routes/intelligenceRoutes');
const { connectDb, ensureDb, readDb } = require('./data/store');
const { requireAuth } = require('./middleware/authMiddleware');
const { sanitizeUser } = require('./utils/auth');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 4000;

const distanceKm = (a, b) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const p =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 6371 * 2 * Math.atan2(Math.sqrt(p), Math.sqrt(1 - p));
};

const getAllowedOrigins = () => {
  const raw = [
    process.env.CLIENT_URL,
    process.env.CLIENT_URLS,
    'http://127.0.0.1:5173',
    'http://localhost:5173',
    'http://127.0.0.1:5174',
    'http://localhost:5174',
    'https://nexhood.vercel.app',
    'https://www.nexhood.vercel.app',
  ]
    .filter(Boolean)
    .flatMap((value) => String(value).split(','))
    .map((value) => value.trim())
    .filter(Boolean);

  return Array.from(new Set(raw));
};

const allowedOrigins = getAllowedOrigins();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', async (_req, res) => {
  res.json({ success: true, status: 'ok' });
});

app.get('/api/dashboard/overview', requireAuth, async (req, res) => {
  const db = await readDb();
  const activePasses = db.passes.filter((pass) => pass.status === 'active');
  const baseNeighborhood = db.neighborhoods[0];
  const userLocation = req.user.preferredLocation;

  const userNeighborhood =
    userLocation && Number.isFinite(userLocation.latitude) && Number.isFinite(userLocation.longitude)
      ? [...db.neighborhoods].sort((left, right) => {
          const leftDistance = distanceKm(
            { lat: userLocation.latitude, lng: userLocation.longitude },
            left.coordinates
          );
          const rightDistance = distanceKm(
            { lat: userLocation.latitude, lng: userLocation.longitude },
            right.coordinates
          );
          return leftDistance - rightDistance;
        })[0] || baseNeighborhood
      : baseNeighborhood;
  const userPasses = db.passes.filter((pass) => pass.residentId === req.user.id);

  res.json({
    success: true,
    user: sanitizeUser(req.user),
    overview: {
      neighborhoodScore: userNeighborhood?.nexScore || 0,
      trackedNeighborhoods: db.neighborhoods.length,
      activePasses: req.user.role === 'resident' ? userPasses.filter((pass) => pass.status === 'active').length : activePasses.length,
      totalGuestSlots: db.society.guestSlots.length,
      occupiedGuestSlots: db.society.guestSlots.filter((slot) => slot.status === 'occupied').length,
      incidents: db.incidents.length,
      featuredNeighborhood: userNeighborhood,
      residentPreferredLocation: userLocation || null,
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/neighborhoods', neighborhoodRoutes);
app.use('/api/neighborhood-data', neighborhoodRoutes);
app.use('/api/parking', parkingRoutes);
app.use('/api', parkingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/intelligence', intelligenceRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Unexpected server error.' });
});

connectDb()
  .then(() => ensureDb())
  .then(() => {
    app.listen(port, () => {
      console.log(`NexHood API listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB Atlas:', error.message);
    process.exit(1);
  });
