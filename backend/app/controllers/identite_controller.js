const identiteService = require('../services/identite_service');

/**
 * Créer une identité
 * POST /identites
 */
exports.create = async (req, res) => {
    try {
        const identite = await identiteService.create(
            req.user.id,
            req.body.nom
        );

        res.status(201).json({
            message: 'Identité créée avec succès',
            identite
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

/**
 * Lister les identités de l'utilisateur connecté
 * GET /identites/me
 */
exports.getMyIdentites = async (req, res) => {
    try {
        const identites = await identiteService.getByUtilisateur(
            req.user.id
        );

        res.status(200).json({
            identites
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

/**
 * Récupérer une identité par ID
 * GET /identites/:id_identite
 */
exports.getById = async (req, res) => {
    try {
        const identite = await identiteService.getById(
            req.params.id_identite
        );

        res.status(200).json({
            identite
        });
    } catch (error) {
        res.status(404).json({
            error: error.message
        });
    }
};

/**
 * Mettre à jour une identité
 * PATCH /identites/:id_identite
 */
exports.update = async (req, res) => {
    try {
        const identite = await identiteService.update(
            req.params.id_identite,
            req.body,
            req.user.id
        );


        res.status(200).json({
            message: 'Identité mise à jour avec succès',
            identite
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};


/**
 * Supprimer une identité
 * DELETE /identites/:id_identite
 */
exports.delete = async (req, res) => {
    try {
        await identiteService.delete(
            req.params.id_identite,
            req.user.id
        );

        res.status(200).json({
            message: 'Identité supprimée avec succès'
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};
