// backend/app/repositories/planning_repository.js
const calendarConfigRepo = require('./planning_calendar_config_repository');
const calendarStateRepo = require('./planning_calendar_state_repository');

const db = require('../driver_connex_db');

/**
 * Récupère tous les plannings
 * @returns {Promise<Array>}
 */
exports.findAll = async () => {
    const { rows } = await db.query('SELECT * FROM planning');
    return rows;
};

/**
 * Récupère un planning par ID
 * @param {number} id_planning
 * @returns {Promise<Object|null>}
 */
exports.findById = async (id_planning) => {
    const { rows } = await db.query(
        'SELECT * FROM planning WHERE id_planning = $1',
        [id_planning]
    );
    return rows[0] || null;
};

exports.findFullById = async (id_planning) => {

    const { rows } = await db.query(
        `SELECT
             p.*,
             c.type_calendrier AS calendrier_type
         FROM planning p
                  JOIN calendrier c
                       ON c.id_calendrier = p.id_calendrier
         WHERE p.id_planning = $1`,
        [id_planning]
    );

    const planning = rows[0];
    if (!planning) return null;

    if (planning.calendrier_type === 'DIEGETIQUE') {

        planning.calendar = {
            type: planning.calendrier_type,
            config: await calendarConfigRepo.findByPlanning(id_planning),
            state: await calendarStateRepo.findByPlanning(id_planning)
        };

    } else {

        planning.calendar = {
            type: planning.calendrier_type
        };
    }

    delete planning.calendrier_type;

    return planning;
};

/**
 * Récupère tous les plannings publics
 * (accessibles même aux visitors)
 */
exports.findPublicPlannings = async () => {
    const { rows } = await db.query(
        'SELECT * FROM planning WHERE public = true'
    );
    return rows;
};

/**
 * Récupère les plannings personnels d'un utilisateur
 * @param {number} id_utilisateur
 */
exports.findByUtilisateur = async (id_utilisateur) => {
    const { rows } = await db.query(
        `SELECT * FROM planning 
         WHERE id_utilisateur = $1`,
        [id_utilisateur]
    );
    return rows;
};

/**
 * Récupère les plannings d'un groupe
 * @param {number} id_groupe
 */
exports.findByGroupe = async (id_groupe) => {
    const { rows } = await db.query(
        `SELECT p.*
         FROM planning p
         JOIN possede po ON po.id_planning = p.id_planning
         WHERE po.id_groupe = $1`,
        [id_groupe]
    );
    return rows;
};

/**
 * Crée un planning personnel (utilisateur)
 * @param {Object} planning
 * @returns {Promise<Object>}
 */
exports.createForUtilisateur = async (planning) => {
    const {
        nom,
        public: isPublic,
        date_,
        heure,
        id_calendrier,
        id_utilisateur
    } = planning;

    const { rows } = await db.query(
        `INSERT INTO planning
            (nom, public, date_, heure, id_calendrier, id_utilisateur)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [nom, isPublic, date_, heure, id_calendrier, id_utilisateur]
    );

    return rows[0];
};

/**
 * Crée un planning de groupe
 * @param {Object} planning
 * @param client
 * @returns {Promise<Object>}
 */
exports.create = async (planning, client = db) => {
    const {
        nom,
        public: isPublic,
        date_,
        heure,
        id_calendrier,
        id_utilisateur
    } = planning;

    const { rows } = await client.query(
        `INSERT INTO planning
         (nom, public, date_, heure, id_calendrier, id_utilisateur)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [nom, isPublic, date_, heure, id_calendrier, id_utilisateur]
    );

    return rows[0];
};

/**
 * Met à jour un planning
 */
exports.update = async (id_planning, updates) => {
    const fields = [];
    const values = [];
    let index = 1;

    for (const key in updates) {
        fields.push(`${key} = $${index}`);
        values.push(updates[key]);
        index++;
    }

    if (fields.length === 0) return null;

    const { rows } = await db.query(
        `UPDATE planning SET ${fields.join(', ')}
         WHERE id_planning = $${index}
         RETURNING *`,
        [...values, id_planning]
    );

    return rows[0];
};

/**
 * Supprime un planning
 */
exports.delete = async (id_planning) => {
    const result = await db.query(
        'DELETE FROM planning WHERE id_planning = $1',
        [id_planning]
    );
    return result.rowCount > 0;
};
