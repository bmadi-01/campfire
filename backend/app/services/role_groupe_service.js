const roleGroupeRepository = require('../repositories/role_groupe_repository');
const levelRepository = require('../repositories/level_repository');
const identiteRepository = require('../repositories/identite_repository');
const groupeRepository = require('../repositories/groupe_repository');

/**
 * Ajoute une identité à un groupe
 * (par défaut : MEMBRE)
 */
exports.addMember = async ({
                               id_groupe,
                               id_identite,
                               addedByIdentiteId
                           }) => {
    // 1️ Vérifier groupe
    const groupe = await groupeRepository.findById(id_groupe);
    if (!groupe) {
        throw new Error('Groupe introuvable');
    }

    // 2️ Vérifier identité cible
    const identite = await identiteRepository.findById(id_identite);
    if (!identite) {
        throw new Error('Identité introuvable');
    }

    // 3️ Vérifier permissions de l’ajout
    await exports.assertOrganisateur(id_groupe, addedByIdentiteId);

    // 4️ Vérifier non-déjà membre
    const existing = await roleGroupeRepository.findOne(id_groupe, id_identite);
    if (existing) {
        throw new Error('Cette identité est déjà membre du groupe');
    }

    // 5️ Récupérer niveau MEMBRE
    const levelMembre = await levelRepository.findByName('MEMBRE');
    if (!levelMembre) {
        throw new Error('Niveau MEMBRE introuvable');
    }

    return await roleGroupeRepository.addToGroupe({
        id_groupe,
        id_identite,
        id_level: levelMembre.id_level
    });
};

/**
 * Change le niveau d’une identité dans un groupe
 */
exports.updateMemberRole = async ({
                                id_groupe,
                                id_identite,
                                newLevelName,
                                changedByIdentiteId
                            }) => {
    // 1️ Vérifier permissions
    await exports.assertOrganisateur(id_groupe, changedByIdentiteId);

    // 2️ Vérifier identité cible
    const role = await roleGroupeRepository.findOne(id_groupe, id_identite);
    if (!role) {
        throw new Error('Cette identité ne fait pas partie du groupe');
    }

    // 3️ Récupérer nouveau niveau
    const newLevel = await levelRepository.findByName(newLevelName);
    if (!newLevel) {
        throw new Error('Niveau invalide');
    }

    // 4️ Sécurité : éviter la perte du dernier organisateur
    if (role.level_nom === 'ORGANISATEUR' && newLevelName !== 'ORGANISATEUR') {
        const organisateurs = await roleGroupeRepository.countByLevel(
            id_groupe,
            'ORGANISATEUR'
        );
        if (organisateurs <= 1) {
            throw new Error('Impossible de retirer le dernier organisateur');
        }
    }

    return await roleGroupeRepository.updateLevel(
        id_groupe,
        id_identite,
        newLevel.id_level
    );
};

/**
 * Supprime une identité d’un groupe
 */
exports.removeMember = async ({
                                  id_groupe,
                                  id_identite,
                                  removedByIdentiteId
                              }) => {
    // 1️ Vérifier permissions
    await exports.assertOrganisateur(id_groupe, removedByIdentiteId);

    // 2️ Vérifier rôle
    const role = await roleGroupeRepository.findOne(id_groupe, id_identite);
    if (!role) {
        throw new Error('Identité non membre du groupe');
    }

    // 3️ Sécurité : dernier organisateur
    if (role.level_nom === 'ORGANISATEUR') {
        const organisateurs = await roleGroupeRepository.countByLevel(
            id_groupe,
            'ORGANISATEUR'
        );
        if (organisateurs <= 1) {
            throw new Error('Impossible de retirer le dernier organisateur');
        }
    }

    return await roleGroupeRepository.delete(id_groupe, id_identite);
};

/**
 * Vérifie si une identité est ORGANISATEUR dans un groupe
 */
exports.assertOrganisateur = async (id_groupe, id_identite) => {
    const role = await roleGroupeRepository.findOne(id_groupe, id_identite);

    if (!role || role.level_nom !== 'ORGANISATEUR') {
        throw new Error('Permission refusée : organisateur requis');
    }

    return true;
};

/**
 * Liste les membres d’un groupe avec leurs rôles
 */
exports.getMembers = async (id_groupe) => {
    return await roleGroupeRepository.findByGroupe(id_groupe);
};
