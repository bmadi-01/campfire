const roleService = require('../services/role_service');

async function getRoles(req, res) {
    try {
        const role = await roleService.getAllRoles();
        res.json(role);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

module.exports = {
    getRoles
};
