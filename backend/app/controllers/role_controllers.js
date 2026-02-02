const roleService = require('../services/role_service');

/**
 * Lister tous les rôles globaux
 * GET /roles
 */
exports.getAll = async (req, res) => {
    try {
        const roles = await roleService.getAll();

        res.status(200).json({
            roles
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

/**
 * Récupérer un rôle par ID
 * GET /roles/:id_role
 */
exports.getById = async (req, res) => {
    try {
        const role = await roleService.getById(
            req.params.id_role
        );

        res.status(200).json({
            role
        });
    } catch (error) {
        res.status(404).json({
            error: error.message
        });
    }
};
