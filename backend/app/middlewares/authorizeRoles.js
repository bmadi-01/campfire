/**
 * Middleware d'autorisation par rôle global
 * @param {...string} allowedRoles rôles autorisés (ADMIN, USER, VISITOR)
 */
exports.authorize = (...allowedRoles) => {
    // Normalisation des rôles autorisés
    const normalizedRoles = allowedRoles.map(r => r.toUpperCase());

    return (req, res, next) => {
        // Sécurité : auth obligatoire
        if (!req.user || !req.user.role) {
            return res.status(401).json({
                message: 'Non authentifié'
            });
        }

        const userRole = String(req.user.role).toUpperCase();

        // Vérification rôle
        if (!normalizedRoles.includes(userRole)) {
            return res.status(403).json({
                message: 'Accès interdit',
                requiredRoles: normalizedRoles,
                userRole
            });
        }

        next();
    };
};
