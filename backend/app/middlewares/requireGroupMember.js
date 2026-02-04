const roleGroupeRepository = require('../repositories/role_groupe_repository');
const identiteRepository = require('../repositories/identite_repository');

/**
 * Middleware : vérifie que l'identité appartient au groupe
 */
exports.requireGroupMember = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Non authentifié' });
        }

        const id_groupe =
            req.params.id_groupe ||
            req.body.id_groupe;

        const id_identite = req.body.id_identite;

        if (!id_groupe || !id_identite) {
            return res.status(400).json({
                message: 'id_groupe et id_identite requis'
            });
        }

        // Vérifier identité
        const identite = await identiteRepository.findById(id_identite);
        if (!identite) {
            return res.status(404).json({
                message: 'Identité introuvable'
            });
        }

        // Sécurité : identité appartient bien à l'utilisateur connecté
        if (identite.id_utilisateur !== req.user.id) {
            return res.status(403).json({
                message: 'Cette identité ne vous appartient pas'
            });
        }

        // Vérifier appartenance au groupe
        const roleGroupe = await roleGroupeRepository.findOne(
            id_groupe,
            id_identite
        );

        if (!roleGroupe) {
            return res.status(403).json({
                message: 'Vous n’êtes pas membre de ce groupe'
            });
        }

        // Injecter le contexte groupe
        req.groupContext = {
            id_groupe,
            id_identite,
            level: roleGroupe.level_nom
        };

        next();
    } catch (error) {
        next(error);
    }
};
