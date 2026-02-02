const roleRepository = require('../repositories/role_repository');

/**
 * Récupère tous les rôles globaux
 * (ADMIN, USER, VISITOR)
 */
exports.getAll = async () => {
    return await roleRepository.findAll();
};

/**
 * Récupère un rôle par son ID
 */
exports.getById = async (id_role) => {
    const role = await roleRepository.findById(id_role);

    if (!role) {
        throw new Error('Rôle introuvable');
    }

    return role;
};

/**
 * Récupère un rôle par son nom
 */
exports.getByName = async (nom) => {
    const role = await roleRepository.findByName(nom);

    if (!role) {
        throw new Error(`Rôle ${nom} introuvable`);
    }

    return role;
};

/**
 * Crée un rôle global
 * ⚠️ À utiliser uniquement par un admin ou un script seed
 */
exports.create = async ({ nom, description }) => {
    const existingRole = await roleRepository.findByName(nom);
    if (existingRole) {
        throw new Error('Ce rôle existe déjà');
    }

    return await roleRepository.create({ nom, description });
};

/**
 * Supprime un rôle global
 * ⚠️ Fortement déconseillé en production
 */
exports.delete = async (id_role) => {
    const role = await roleRepository.findById(id_role);
    if (!role) {
        throw new Error('Rôle introuvable');
    }

    // Sécurité minimale : empêcher la suppression des rôles cœur
    if (['ADMIN', 'USER', 'VISITOR'].includes(role.nom)) {
        throw new Error('Impossible de supprimer un rôle système');
    }

    return await roleRepository.delete(id_role);
};
