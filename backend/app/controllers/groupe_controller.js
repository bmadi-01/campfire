const groupeService = require('../services/groupe_service');
const roleGroupeService = require('../services/role_groupe_service');

/**
 * Créer un groupe
 * POST /groupes
 */
exports.create = async (req, res) => {
    try {
        const groupe = await groupeService.create(
            req.body,
            req.user.id
        );

        res.status(201).json({
            message: 'Groupe créé avec succès',
            groupe
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

/**
 * Récupérer un groupe par ID
 * GET /groupes/:id_groupe
 */
exports.getById = async (req, res) => {
    try {
        const groupe = await groupeService.getById(
            req.params.id_groupe
        );

        res.status(200).json({
            groupe
        });
    } catch (error) {
        res.status(404).json({
            error: error.message
        });
    }
};

/**
 * Ajouter un membre au groupe
 * POST /groupes/:id_groupe/membres
 */
exports.addMember = async (req, res) => {
    try {
        const { id_identite, id_level } = req.body;

        const membre = await roleGroupeService.addMember(
            req.params.id_groupe,
            id_identite,
            id_level
        );

        res.status(201).json({
            message: 'Membre ajouté au groupe',
            membre
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

/**
 * Modifier le rôle d’un membre
 * PUT /groupes/:id_groupe/membres/:id_identite
 */
exports.updateMemberRole = async (req, res) => {
    try {
        const { id_level } = req.body;

        const membre = await roleGroupeService.updateMemberRole(
            req.params.id_groupe,
            req.params.id_identite,
            id_level
        );

        res.status(200).json({
            message: 'Rôle du membre mis à jour',
            membre
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

/**
 * Supprimer un membre du groupe
 * DELETE /groupes/:id_groupe/membres/:id_identite
 */
exports.removeMember = async (req, res) => {
    try {
        await roleGroupeService.removeMember(
            req.params.id_groupe,
            req.params.id_identite
        );

        res.status(200).json({
            message: 'Membre supprimé du groupe'
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

/**
 * Supprimer un groupe
 * DELETE /groupes/:id_groupe
 */
exports.delete = async (req, res) => {
    try {
        await groupeService.delete(
            req.params.id_groupe
        );

        res.status(200).json({
            message: 'Groupe supprimé avec succès'
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};
