const roleGroupeService = require('../services/role_groupe_service');

/**
 * Lister les membres d’un groupe
 * GET /groupes/:id_groupe/membres
 */
exports.getMembers = async (req, res) => {
    try {
        const membres = await roleGroupeService.getMembers(
            req.params.id_groupe
        );

        res.status(200).json({ membres });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Modifier le rôle d’un membre
 * PUT /groupes/:id_groupe/membres/:id_identite
 */
exports.updateRole = async (req, res) => {
    try {
        const { id_level } = req.body;

        const membre = await roleGroupeService.updateMemberRole(
            req.params.id_groupe,
            req.params.id_identite,
            id_level
        );

        res.status(200).json({
            message: 'Rôle mis à jour',
            membre
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Retirer un membre du groupe
 * DELETE /groupes/:id_groupe/membres/:id_identite
 */
exports.remove = async (req, res) => {
    try {
        await roleGroupeService.removeMember(
            req.params.id_groupe,
            req.params.id_identite
        );

        res.status(200).json({
            message: 'Membre retiré du groupe'
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
