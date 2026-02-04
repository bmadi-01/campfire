/**
 * Middleware : vérifie que l'identité est ORGANISATEUR du groupe
 */
exports.requireGroupOrganisateur = (req, res, next) => {
    if (!req.groupContext) {
        return res.status(500).json({
            message: 'Contexte groupe manquant (requireGroupMember requis)'
        });
    }

    const { level } = req.groupContext;

    if (level !== 'ORGANISATEUR') {
        return res.status(403).json({
            message: 'Permission refusée : organisateur requis'
        });
    }

    next();
};
