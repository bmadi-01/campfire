const groupeRepository = require('../repositories/groupe_repository');
const planningRepository = require('../repositories/planning_repository');
const possedeRepository = require('../repositories/possede_repository');
const identiteRepository = require('../repositories/identite_repository');
const roleGroupeRepository = require('../repositories/role_groupe_repository');
const levelRepository = require('../repositories/level_repository');
const utilisateurRepository = require('../repositories/utilisateur_repository');
const calendrierRepository = require('../repositories/calendrier_repository');
const db = require('../driver_connex_db');

/**
 * Création d’un groupe
 * - crée le groupe
 * - crée les plannings public & privé
 * - rattache les plannings au groupe
 * - crée l’identité organisateur
 * - assigne le niveau ORGANISATEUR
 */
exports.create = async ({ nom, description }, id_utilisateur) => {
    const client = await db.connect();

    try {
        await client.query('BEGIN');

        // 1️ Vérifier utilisateur
        const utilisateur = await utilisateurRepository.findById(id_utilisateur);
        if (!utilisateur) {
            throw new Error('Utilisateur introuvable');
        }

        // 2️ Créer le groupe
        const groupe = await groupeRepository.create({
            nom,
            description,
            date_creation: new Date()
        });

        // 3️ Récupérer le calendrier GREGORIEN par défaut
        const calendrier = await calendrierRepository.findByType('GREGORIEN');
        if (!calendrier) {
            throw new Error('Calendrier GREGORIEN introuvable');
        }

        // 4️ Créer planning public du groupe
        const planningPublic = await planningRepository.createForGroupe(
            {
                nom: `${nom} - public`,
                public: true,
                date_: new Date(),
                heure: new Date(),
                id_calendrier: calendrier.id_calendrier,
                id_utilisateur
            },
            groupe.id_groupe
        );

        // 5️ Créer planning privé du groupe
        const planningPrive = await planningRepository.createForGroupe(
            {
                nom: `${nom} - privé`,
                public: false,
                date_: new Date(),
                heure: new Date(),
                id_calendrier: calendrier.id_calendrier,
                id_utilisateur
            },
            groupe.id_groupe
        );

        // 6️ Lier plannings au groupe
        await possedeRepository.addPlanningToGroupe(
            groupe.id_groupe,
            planningPublic.id_planning
        );
        await possedeRepository.addPlanningToGroupe(
            groupe.id_groupe,
            planningPrive.id_planning
        );

        // 7️ Créer l’identité organisateur
        const identite = await identiteRepository.create({
            nom: utilisateur.pseudo || utilisateur.prenom,
            id_utilisateur
        });

        // 8️ Récupérer le niveau ORGANISATEUR
        const levelOrganisateur = await levelRepository.findByName('ORGANISATEUR');
        if (!levelOrganisateur) {
            throw new Error('Niveau ORGANISATEUR introuvable');
        }

        // 9️ Assigner le rôle dans le groupe
        await roleGroupeRepository.addToGroupe({
            id_groupe: groupe.id_groupe,
            id_identite: identite.id_identite,
            id_level: levelOrganisateur.id_level
        });

        await client.query('COMMIT');

        return {
            groupe,
            plannings: {
                public: planningPublic,
                prive: planningPrive
            },
            organisateur: identite
        };

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

/**
 * Récupère un groupe par ID
 */
exports.getById = async (id_groupe) => {
    const groupe = await groupeRepository.findById(id_groupe);
    if (!groupe) {
        throw new Error('Groupe introuvable');
    }
    return groupe;
};

/**
 * Liste tous les groupes
 */
exports.getAll = async () => {
    return await groupeRepository.findAll();
};

/**
 * Met à jour un groupe
 */
exports.update = async (id_groupe, updates) => {
    const groupe = await groupeRepository.findById(id_groupe);
    if (!groupe) {
        throw new Error('Groupe introuvable');
    }

    const allowedFields = ['nom', 'description'];
    const safeUpdates = {};

    for (const key of allowedFields) {
        if (updates[key] !== undefined) {
            safeUpdates[key] = updates[key];
        }
    }

    if (Object.keys(safeUpdates).length === 0) {
        throw new Error('Aucune donnée valide à mettre à jour');
    }

    return await groupeRepository.update(id_groupe, safeUpdates);
};

/**
 * Supprime un groupe
 * ⚠️ Cascade métier à prévoir (plannings, événements, identités)
 */
exports.delete = async (id_groupe) => {
    const groupe = await groupeRepository.findById(id_groupe);
    if (!groupe) {
        throw new Error('Groupe introuvable');
    }

    return await groupeRepository.delete(id_groupe);
};
