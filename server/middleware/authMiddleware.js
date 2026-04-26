const { readDb } = require('../data/store');
const { verifyToken } = require('../utils/auth');

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const payload = verifyToken(token);
    const db = await readDb();
    const user = db.users.find((entry) => entry.id === payload.sub);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User session is invalid.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'You do not have access to this resource.' });
  }

  next();
};

module.exports = {
  requireAuth,
  requireRole,
};
