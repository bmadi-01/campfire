const disponibiliteRepository = require('../repositories/disponibilite_repository');
const identiteRepository = require('../repositories/identite_repository');
const evenementRepository = require('../repositories/evenement_repository');
const roleGroupeRepository = require('../repositories/role_groupe_repository');

// Cache abstrait (peut être Redis plus tard)
const invitationCache = new Map();

/**
 * Invite une identité à un événement
 * (stockée uniquement en cache)
 */
exports.invite = async ({ id_evenement, id_identite }) => {
    const evenement = await evenementRepository.findById(id_evenement);
    if (!evenement) {
        throw new Error('Événement introuvable');
    }

    const identite = await identiteRepository.findById(id_identite);
    if (!identite) {
        throw new Error('Identité introuvable');
    }

    const token = `${id_evenement}:${id_identite}:${Date.now()}`;

    invitationCache.set(token, {
        id_evenement,
        id_identite,
        createdAt: Date.now(),
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 // 24h
    });

    return { token };
};

/**
 * Répond à une invitation (via token)
 */
exports.respondToInvitation = async ({ token, id_presence }) => {
    const invitation = invitationCache.get(token);
    if (!invitation) {
        throw new Error('Invitation invalide ou expirée');
    }

    const { id_evenement, id_identite, expiresAt } = invitation;

    if (Date.now() > expiresAt) {
        invitationCache.delete(token);
        throw new Error('Invitation expirée');
    }

    // Vérifier si une réponse existe déjà
    const existing = await disponibiliteRepository.findOne(
        id_identite,
        id_evenement
    );

    let result;
    if (existing) {
        result = await disponibiliteRepository.update({
            id_identite,
            id_evenement,
            id_presence
        });
    } else {
        result = await disponibiliteRepository.create({
            id_identite,
            id_evenement,
            id_presence
        });
    }

    invitationCache.delete(token);
    return result;
};

/**
 * Réponse directe à un événement (utilisateur connecté)
 */
exports.respond = async ({
                             id_evenement,
                             id_identite,
                             id_presence
                         }) => {
    const evenement = await evenementRepository.findById(id_evenement);
    if (!evenement) {
        throw new Error('Événement introuvable');
    }

    const identite = await identiteRepository.findById(id_identite);
    if (!identite) {
        throw new Error('Identité introuvable');
    }

    const existing = await disponibiliteRepository.findOne(
        id_identite,
        id_evenement
    );

    if (existing) {
        return await disponibiliteRepository.update({
            id_identite,
            id_evenement,
            id_presence
        });
    }

    return await disponibiliteRepository.create({
        id_identite,
        id_evenement,
        id_presence
    });
};

/**
 * Supprime une réponse
 */
exports.remove = async ({ id_evenement, id_identite }) => {
    const existing = await disponibiliteRepository.findOne(
        id_identite,
        id_evenement
    );

    if (!existing) {
        throw new Error('Aucune réponse à supprimer');
    }

    return await disponibiliteRepository.delete(id_identite, id_evenement);
};

/**
 * Liste les réponses d’un événement
 */
exports.getByEvenement = async (id_evenement) => {
    return await disponibiliteRepository.findByEvenement(id_evenement);
};

/**
 * Liste les réponses d’une identité
 */
exports.getByIdentite = async (id_identite) => {
    return await disponibiliteRepository.findByIdentite(id_identite);
};
