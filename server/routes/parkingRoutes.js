const express = require('express');
const crypto = require('crypto');
const { readDb, writeDb } = require('../data/store');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const { generateQrCode } = require('../utils/qr');
const { signVisitorToken, verifyToken } = require('../utils/auth');

const router = express.Router();

const syncExpiredPasses = (db) => {
  const now = Date.now();
  db.passes.forEach((pass) => {
    if (pass.status === 'active' && new Date(pass.validUntil).getTime() < now) {
      pass.status = 'expired';
      const slot = db.society.guestSlots.find((entry) => entry.slotId === pass.slotAssigned);
      if (slot) {
        slot.status = 'available';
        slot.passId = null;
      }
    }
  });
};

const getSlotsHandler = async (_req, res) => {
  const db = await readDb();
  syncExpiredPasses(db);
  await writeDb(db);

  const slots = db.society.guestSlots.map((slot) => {
    const pass = db.passes.find((entry) => entry.id === slot.passId);
    return {
      ...slot,
      visitorName: pass?.visitorName || null,
      vehicleNumber: pass?.vehicleNumber || null,
      validUntil: pass?.validUntil || null,
    };
  });

  res.json({
    success: true,
    society: db.society,
    summary: {
      totalGuestSlots: slots.length,
      available: slots.filter((slot) => slot.status === 'available').length,
      occupied: slots.filter((slot) => slot.status === 'occupied').length,
    },
    slots,
  });
};

const getPassesHandler = async (req, res) => {
  const db = await readDb();
  syncExpiredPasses(db);
  await writeDb(db);

  const passes =
    req.user.role === 'resident'
      ? db.passes.filter((pass) => pass.residentId === req.user.id)
      : db.passes;

  res.json({
    success: true,
    passes: passes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  });
};

const createPassHandler = async (req, res) => {
  const { visitorName, vehicleNumber, arrivalWindowStart, durationHours, hostApartment } = req.body;

  if (!visitorName || !vehicleNumber || !arrivalWindowStart || !durationHours) {
    return res.status(400).json({ success: false, message: 'Visitor details are incomplete.' });
  }

  const db = await readDb();
  syncExpiredPasses(db);

  const availableSlot = db.society.guestSlots.find((slot) => slot.status === 'available');
  if (!availableSlot) {
    return res.status(409).json({ success: false, message: 'No guest slot is available right now.' });
  }

  const pass = {
    id: `pass-${crypto.randomUUID()}`,
    residentId: req.user.id,
    societyId: db.society.id,
    visitorName: visitorName.trim(),
    vehicleNumber: vehicleNumber.trim().toUpperCase(),
    hostApartment: hostApartment?.trim() || req.user.apartment || 'Unassigned',
    arrivalWindowStart,
    validUntil: new Date(new Date(arrivalWindowStart).getTime() + Number(durationHours) * 60 * 60 * 1000).toISOString(),
    durationHours: Number(durationHours),
    slotAssigned: availableSlot.slotId,
    status: 'active',
    auditLogs: [],
    createdAt: new Date().toISOString(),
    qrPayload: '',
  };

  pass.qrPayload = signVisitorToken(pass);
  pass.qrCode = await generateQrCode(pass.qrPayload);

  availableSlot.status = 'occupied';
  availableSlot.passId = pass.id;
  db.passes.push(pass);
  await writeDb(db);

  res.status(201).json({
    success: true,
    pass,
  });
};

const verifyPassHandler = async (req, res) => {
  try {
    const { token, scanType = 'entry' } = req.body;
    const normalizedToken = String(token || '').trim();

    if (!normalizedToken) {
      return res.status(400).json({ success: false, message: 'Scan token is required.' });
    }

    const payload = verifyToken(normalizedToken);
    if (payload.type !== 'visitor_pass') {
      return res.status(400).json({ success: false, message: 'Invalid QR payload.' });
    }

    const db = await readDb();
    syncExpiredPasses(db);
    const pass = db.passes.find((entry) => entry.id === payload.passId);

    if (!pass) {
      return res.status(404).json({ success: false, message: 'Pass not found.' });
    }

    if (pass.status === 'expired') {
      return res.status(403).json({ success: false, message: 'This pass has expired.', pass });
    }

    if (scanType === 'entry' && pass.auditLogs.some((log) => log.scanType === 'entry')) {
      return res.json({
        success: true,
        duplicate: true,
        message: 'Pass already checked in earlier.',
        pass,
      });
    }

    if (scanType === 'exit') {
      pass.status = 'completed';
      const slot = db.society.guestSlots.find((entry) => entry.slotId === pass.slotAssigned);
      if (slot) {
        slot.status = 'available';
        slot.passId = null;
      }
    }

    pass.auditLogs.unshift({
      timestamp: new Date().toISOString(),
      scanType,
      result: 'success',
      guardId: req.user.id,
      note:
        scanType === 'entry'
          ? `Entry approved for slot ${pass.slotAssigned}.`
          : `Exit recorded and slot ${pass.slotAssigned} released.`,
    });

    await writeDb(db);

    res.json({
      success: true,
      pass,
      message:
        scanType === 'entry'
          ? `Access granted. Direct visitor to slot ${pass.slotAssigned}.`
          : `Exit recorded. Slot ${pass.slotAssigned} is available again.`,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Unable to verify this pass.' });
  }
};

const markExitHandler = async (req, res) => {
  const db = await readDb();
  const passId = req.params.id || req.params.pass_id;
  const pass = db.passes.find((entry) => entry.id === passId);

  if (!pass) {
    return res.status(404).json({ success: false, message: 'Pass not found.' });
  }

  pass.status = 'completed';
  pass.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    scanType: 'exit',
    result: 'success',
    guardId: req.user.id,
    note: `Manual exit recorded for ${pass.slotAssigned}.`,
  });

  const slot = db.society.guestSlots.find((entry) => entry.slotId === pass.slotAssigned);
  if (slot) {
    slot.status = 'available';
    slot.passId = null;
  }

  await writeDb(db);

  res.json({
    success: true,
    pass,
  });
};

router.get('/slots', requireAuth, getSlotsHandler);
router.get('/slots/:society_id', requireAuth, getSlotsHandler);
router.get('/passes', requireAuth, getPassesHandler);
router.post('/passes', requireAuth, requireRole('resident', 'admin'), createPassHandler);
router.post('/verify', requireAuth, requireRole('guard', 'admin'), verifyPassHandler);
router.patch('/passes/:id/exit', requireAuth, requireRole('guard', 'admin'), markExitHandler);

router.post('/visitor-pass', requireAuth, requireRole('resident', 'admin'), createPassHandler);
router.post('/verify-qr', requireAuth, requireRole('guard', 'admin'), verifyPassHandler);
router.patch('/visitor-pass/:id/exit', requireAuth, requireRole('guard', 'admin'), markExitHandler);
router.patch('/visitor-pass/:pass_id/exit', requireAuth, requireRole('guard', 'admin'), markExitHandler);

module.exports = router;
