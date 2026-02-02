// backend/app/middlewares/auth_jwt_middleware.js
const jwtUtils = require('../utils/jwt');

/**
 * Middleware d'authentification JWT
 */
exports.authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Authentification requise' });
        }

        // Format: Bearer <token>
        const [type, token] = authHeader.split(' ');

        if (type !== 'Bearer' || !token) {
            return res.status(401).json({ message: 'Format du token invalide' });
        }

        const decoded = jwtUtils.verifyToken(token);

        // Injecter l'utilisateur décodé
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Token invalide ou expiré'
        });
    }
};
