const calendrierRepository = require('../repositories/calendrier_repository');

/**
 * Types de calendriers autorisés dans Campfire
 */
const ALLOWED_CALENDARS = ['GREGORIEN', 'DIEGETIQUE'];

/**
 * Récupère tous les calendriers
 */
exports.getAll = async () => {
    return await calendrierRepository.findAll();
};

/**
 * Récupère un calendrier par ID
 */
exports.getById = async (id_calendrier) => {
    const calendrier = await calendrierRepository.findById(id_calendrier);
    if (!calendrier) {
        throw new Error('Calendrier introuvable');
    }
    return calendrier;
};

/**
 * Récupère un calendrier par type
 */
exports.getByType = async (type_calendrier) => {
    const normalizedType = type_calendrier.toUpperCase();

    const calendrier = await calendrierRepository.findByType(normalizedType);
    if (!calendrier) {
        throw new Error(`Calendrier ${normalizedType} introuvable`);
    }

    return calendrier;
};

/**
 * Crée un calendrier
 * ⚠️ Réservé au seed / admin
 */
exports.create = async ({ type_calendrier }) => {
    const normalizedType = type_calendrier.toUpperCase();

    if (!ALLOWED_CALENDARS.includes(normalizedType)) {
        throw new Error('Type de calendrier non autorisé');
    }

    const existing = await calendrierRepository.findByType(normalizedType);
    if (existing) {
        throw new Error('Ce calendrier existe déjà');
    }

    return await calendrierRepository.create({
        type_calendrier: normalizedType
    });
};

/**
 * Suppression interdite
 */
exports.delete = async (id_calendrier) => {
    const calendrier = await calendrierRepository.findById(id_calendrier);
    if (!calendrier) {
        throw new Error('Calendrier introuvable');
    }

    throw new Error('Suppression d’un calendrier interdite en production');
};
