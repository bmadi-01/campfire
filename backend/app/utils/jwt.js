const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || 'campfire_super_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

/**
 * Génère un token JWT
 */
exports.signToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};
/**
 * Vérifie un token JWT
 */
exports.verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};