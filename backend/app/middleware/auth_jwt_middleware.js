const jwtUtils = require('../utils/jwt');

/**
 * Middleware d'authentification JWT
 * Vérifie si l'utilisateur est connecté
 */

exports.authenticate = (req, res, next) => {
    try {
        // 1️ Récupérer le header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Token manquant' });
        }

        // Format attendu : "Bearer token"
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ message: 'Format du token invalide' });
        }

        const token = parts[1];

        // 2️ Vérifier le token
        const decoded = jwtUtils.verifyToken(token);

        // 3️ Injecter l'utilisateur dans la requête
        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        // 4️ Continuer vers la route
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Token invalide ou expiré'
        });
    }
};
