const levelRepository = require('../repositories/level_repository');

/**
 * Hiérarchie des niveaux (du plus fort au plus faible)
 */
const LEVEL_HIERARCHY = [
    'ORGANISATEUR',
    'MEMBRE',
    'INVITE'
];

/**
 * Récupère tous les niveaux
 */
exports.getAll = async () => {
    return await levelRepository.findAll();
};

/**
 * Récupère un niveau par ID
 */
exports.getById = async (id_level) => {
    const level = await levelRepository.findById(id_level);
    if (!level) {
        throw new Error('Niveau introuvable');
    }
    return level;
};

/**
 * Récupère un niveau par nom
 */
exports.getByName = async (nom) => {
    const normalizedName = nom.toUpperCase();

    const level = await levelRepository.findByName(normalizedName);
    if (!level) {
        throw new Error(`Niveau ${normalizedName} introuvable`);
    }

    return level;
};

/**
 * Crée un niveau
 * ⚠️ Réservé au seed / admin
 */
exports.create = async ({ nom }) => {
    const normalizedName = nom.toUpperCase();

    if (!LEVEL_HIERARCHY.includes(normalizedName)) {
        throw new Error('Niveau non autorisé');
    }

    const existing = await levelRepository.findByName(normalizedName);
    if (existing) {
        throw new Error('Ce niveau existe déjà');
    }

    return await levelRepository.create({
        nom: normalizedName
    });
};

/**
 * Compare deux niveaux
 * @returns true si levelA >= levelB
 */
exports.isAtLeast = (levelA, levelB) => {
    return (
        LEVEL_HIERARCHY.indexOf(levelA) <=
        LEVEL_HIERARCHY.indexOf(levelB)
    );
};

/**
 * Supprime un niveau
 * ⚠️ Fortement déconseillé
 */
exports.delete = async (id_level) => {
    const level = await levelRepository.findById(id_level);
    if (!level) {
        throw new Error('Niveau introuvable');
    }

    throw new Error('Suppression d’un niveau interdite en production');
};
