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

        if (!decoded.id) {
            return res.status(401).json({
                message: 'Token invalide (id utilisateur manquant)'
            });
        }

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

/**
 * Middleware d'authentification JWT Optionnel
 * Utile pour les routes qui peuvent être lues par le public OU des membres.
 */
exports.optionalAuthenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Pas de token ? On passe à la suite sans erreur
        if (!authHeader) {
            return next();
        }

        const [type, token] = authHeader.split(' ');

        // Mauvais format ? On passe à la suite
        if (type !== 'Bearer' || !token) {
            return next();
        }

        const decoded = jwtUtils.verifyToken(token);

        if (decoded.id) {
            // Si le token est bon, on injecte l'utilisateur
            req.user = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role
            };
        }

        next();
    } catch (error) {
        // Token invalide ou expiré, on le traite comme un visiteur non connecté
        next();
    }
};