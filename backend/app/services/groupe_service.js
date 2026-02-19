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
 * Récupère les groupes de l'utilisateur connecté
 */
exports.getMyGroups = async (id_utilisateur) => {
    return await groupeRepository.findByUserId(id_utilisateur);
};

/**
 * Création d’un groupe
 * - crée le groupe
 * - crée les plannings public & privé
 * - rattache les plannings au groupe
 * - crée l’identité organisateur
 * - assigne le niveau ORGANISATEUR
 */

exports.create = async ({ nom, description, id_identite }, userId) => {
    const client = await db.connect();

    try {
        // await client.query('BEGIN');

        // 1️⃣ Vérifier utilisateur
        const utilisateur = await utilisateurRepository.findById(userId);
        if (!utilisateur) {
            throw new Error('Utilisateur introuvable');
        }

        // 2️⃣ Vérifier nom unique
        const existingGroup = await groupeRepository.findByName(nom);
        if (existingGroup) {
            throw new Error('Le nom de ce groupe existe déjà');
        }

        // 3️⃣ Vérifier identité existante
        const identite = await identiteRepository.findById(id_identite);
        if (!identite || identite.id_utilisateur !== userId) {
            throw new Error('Identité invalide');
        }

        // 4️⃣ Créer groupe (avec transaction)
        const groupe = await client.query(
            `INSERT INTO groupe (nom, description, date_creation)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [nom, description, new Date()]
        );


        const groupeCree = groupe.rows[0];
        console.log("ID GROUPE:", groupeCree.id_groupe);


        // 5️⃣ Récupérer calendrier GREGORIEN par défaut
        const calendrier = await calendrierRepository.findByType('GREGORIEN');
        if (!calendrier) {
            throw new Error('Calendrier GREGORIEN introuvable');
        }

        // 6️⃣ Créer planning public
        const planningPublic = await planningRepository.create(
            {
                nom: `${nom} - public`,
                public: true,
                date_: new Date(),
                heure: new Date(),
                id_calendrier: calendrier.id_calendrier,
                id_utilisateur: userId
            },
            client
        );

        // 7️⃣ Créer planning privé
        const planningPrive = await planningRepository.create(
            {
                nom: `${nom} - privé`,
                public: false,
                date_: new Date(),
                heure: new Date(),
                id_calendrier: calendrier.id_calendrier,
                id_utilisateur: userId
            },
            client
        );

        // 8️⃣ Lier plannings au groupe
        await possedeRepository.create(
            { id_groupe: groupeCree.id_groupe, id_planning: planningPublic.id_planning },
            client
        );

        await possedeRepository.create(
            { id_groupe: groupeCree.id_groupe, id_planning: planningPrive.id_planning },
            client
        );

        // 9️⃣ Récupérer niveau ORGANISATEUR
        const level = await levelRepository.findByName('ORGANISATEUR');
        if (!level) {
            throw new Error('Niveau ORGANISATEUR introuvable');
        }

        // 🔟 Assigner rôle à l'identité EXISTANTE
        await roleGroupeRepository.addToGroupe(
            {
                id_groupe: groupeCree.id_groupe,
                id_identite,
                id_level: level.id_level
            },
            client
        );

        // await client.query('COMMIT');

        return groupeCree;

    } catch (error) {
        // await client.query('ROLLBACK');
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
