const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getJwtSecret = () => process.env.JWT_SECRET || 'nexhood-dev-secret';

const signAuthToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email,
    },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

const signVisitorToken = (pass) =>
  jwt.sign(
    {
      type: 'visitor_pass',
      passId: pass.id,
      validUntil: pass.validUntil,
    },
    getJwtSecret(),
    { expiresIn: '7d' }
  );

const verifyToken = (token) => jwt.verify(token, getJwtSecret());

const hashPassword = (password) => bcrypt.hash(password, 10);

const comparePassword = (password, hash) => bcrypt.compare(password, hash);

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  apartment: user.apartment,
  societyId: user.societyId,
  authProvider: user.authProvider,
  preferredLocation: user.preferredLocation || null,
});

module.exports = {
  signAuthToken,
  signVisitorToken,
  verifyToken,
  hashPassword,
  comparePassword,
  sanitizeUser,
};
