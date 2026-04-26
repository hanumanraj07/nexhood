const express = require('express');
const { readDb } = require('../data/store');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth, requireRole('admin'));

router.get('/residents', async (_req, res) => {
  const db = await readDb();
  const residents = db.users.filter((user) => user.role === 'resident');

  res.json({
    success: true,
    residents,
    incidents: db.incidents,
  });
});

router.get('/overview', async (_req, res) => {
  const db = await readDb();
  const activePasses = db.passes.filter((pass) => pass.status === 'active').length;

  res.json({
    success: true,
    stats: {
      totalResidents: db.users.filter((user) => user.role === 'resident').length,
      activePasses,
      totalIncidents: db.incidents.length,
      occupiedSlots: db.society.guestSlots.filter((slot) => slot.status === 'occupied').length,
    },
  });
});

module.exports = router;
