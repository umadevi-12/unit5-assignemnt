const jwtUtils = require('../utils/jwt');
const BlacklistedToken = require('../models/BlacklistedToken');
const User = require('../models/User');

async function checkBlacklisted(token) {
  if (!token) return false;
  const found = await BlacklistedToken.findOne({ token });
  return !!found;
}

// Extract token from header "Authorization: Bearer <token>"
function getBearerToken(req) {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) return null;
  return h.split(' ')[1];
}

async function requireAuth(req, res, next) {
  try {
    const token = getBearerToken(req);
    if (!token) return res.status(401).json({ error: 'No token provided' });

    // check blacklist
    if (await checkBlacklisted(token)) return res.status(401).json({ error: 'Token invalidated (blacklisted)' });

    const payload = jwtUtils.verifyAccessToken(token);
    // attach user id & role
    req.user = { id: payload.id, role: payload.role };
    // optional: fetch fresh user
    req.fullUser = await User.findById(payload.id);
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden - insufficient role' });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole, checkBlacklisted, getBearerToken };
