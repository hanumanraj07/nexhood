const express = require('express');
const crypto = require('crypto');
const { readDb, writeDb } = require('../data/store');
const {
  signAuthToken,
  hashPassword,
  comparePassword,
  sanitizeUser,
} = require('../utils/auth');
const { requireAuth } = require('../middleware/authMiddleware');
const { verifyGoogleCredential } = require('../utils/googleAuth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, apartment, role = 'resident' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
    }

    const db = await readDb();
    const normalizedEmail = email.trim().toLowerCase();

    if (db.users.some((user) => user.email === normalizedEmail)) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const user = {
      id: `user-${crypto.randomUUID()}`,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: await hashPassword(password),
      role: ['admin', 'resident', 'guard'].includes(role) ? role : 'resident',
      apartment: apartment?.trim() || 'Unassigned',
      societyId: db.society.id,
      authProvider: 'local',
      createdAt: new Date().toISOString(),
    };

    db.users.push(user);
    await writeDb(db);

    res.status(201).json({
      success: true,
      token: signAuthToken(user),
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to register right now.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const db = await readDb();
    const user = db.users.find((entry) => entry.email === email.trim().toLowerCase());

    if (!user || !user.passwordHash) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isValid = await comparePassword(password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    res.json({
      success: true,
      token: signAuthToken(user),
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to sign in right now.' });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    const payload = await verifyGoogleCredential(credential, process.env.GOOGLE_CLIENT_ID);
    const db = await readDb();

    let user = db.users.find((entry) => entry.email === payload.email.toLowerCase());

    if (!user) {
      user = {
        id: `user-${crypto.randomUUID()}`,
        name: payload.name || payload.email.split('@')[0],
        email: payload.email.toLowerCase(),
        passwordHash: null,
        role: 'resident',
        apartment: 'Unassigned',
        societyId: db.society.id,
        authProvider: 'google',
        googleId: payload.sub,
        avatar: payload.picture,
        createdAt: new Date().toISOString(),
      };
      db.users.push(user);
    } else {
      user.authProvider = 'google';
      user.googleId = payload.sub;
      user.avatar = payload.picture;
    }

    await writeDb(db);

    res.json({
      success: true,
      token: signAuthToken(user),
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message || 'Google authentication failed.' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  res.json({
    success: true,
    user: sanitizeUser(req.user),
  });
});

module.exports = router;
