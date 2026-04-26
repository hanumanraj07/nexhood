const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const neighborhoodRoutes = require('./routes/neighborhoodRoutes');
const parkingRoutes = require('./routes/parkingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const intelligenceRoutes = require('./routes/intelligenceRoutes');
const { connectDb, ensureDb, readDb } = require('./data/store');
const { requireAuth } = require('./middleware/authMiddleware');
const { sanitizeUser } = require('./utils/auth');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const getAllowedOrigins = () => {
  const raw = [
    process.env.CLIENT_URL,
    process.env.CLIENT_URLS,
    'http://127.0.0.1:5173',
    'http://localhost:5173',
    'http://127.0.0.1:5174',
    'http://localhost:5174',
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
  const userNeighborhood = db.neighborhoods[0];
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
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/neighborhoods', neighborhoodRoutes);
app.use('/api/parking', parkingRoutes);
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
