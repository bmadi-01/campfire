const presenceRepository = require('../repositories/presence_repository');

/**
 * États autorisés dans Campfire
 */
const ALLOWED_PRESENCES = ['PRESENT', 'ABSENT', 'PEUT_ETRE'];

/**
 * Récupère toutes les présences possibles
 */
exports.getAll = async () => {
    return await presenceRepository.findAll();
};

/**
 * Récupère une présence par ID
 */
exports.getById = async (id_presence) => {
    const presence = await presenceRepository.findById(id_presence);
    if (!presence) {
        throw new Error('Présence introuvable');
    }
    return presence;
};

/**
 * Récupère une présence par nom
 */
exports.getByName = async (nom) => {
    const presence = await presenceRepository.findByName(nom);
    if (!presence) {
        throw new Error(`Présence ${nom} introuvable`);
    }
    return presence;
};

/**
 * Crée une présence
 * ⚠️ Réservé au seed / admin
 */
exports.create = async ({ nom, background, foreground }) => {
    const normalizedName = nom.toUpperCase();

    if (!ALLOWED_PRESENCES.includes(normalizedName)) {
        throw new Error('Type de présence non autorisé');
    }

    const existing = await presenceRepository.findByName(normalizedName);
    if (existing) {
        throw new Error('Cette présence existe déjà');
    }

    return await presenceRepository.create({
        nom: normalizedName,
        background,
        foreground
    });
};

/**
 * Met à jour une présence
 * ⚠️ Très rare en production
 */
exports.update = async (id_presence, updates) => {
    const allowedFields = ['background', 'foreground'];

    const safeUpdates = {};
    for (const key of allowedFields) {
        if (updates[key] !== undefined) {
            safeUpdates[key] = updates[key];
        }
    }

    if (Object.keys(safeUpdates).length === 0) {
        throw new Error('Aucune donnée valide à mettre à jour');
    }

    return await presenceRepository.update(id_presence, safeUpdates);
};

/**
 * Supprime une présence
 * ⚠️ Fortement déconseillé (référencée par disponibilités)
 */
exports.delete = async (id_presence) => {
    const presence = await presenceRepository.findById(id_presence);
    if (!presence) {
        throw new Error('Présence introuvable');
    }

    throw new Error('Suppression d’une présence interdite en production');
};
