// backend/app/repositories/evenement_repository.js
const db = require('../driver_connex_db');

/**
 * Récupère tous les événements
 */
exports.findAll = async () => {
    const { rows } = await db.query(
        'SELECT * FROM evenement'
    );
    return rows;
};

/**
 * Récupère un événement par ID
 */
exports.findById = async (id_evenement) => {
    const { rows } = await db.query(
        'SELECT * FROM evenement WHERE id_evenement = $1',
        [id_evenement]
    );
    return rows[0] || null;
};

/**
 * Récupère les événements d'un planning
 */
exports.findByPlanning = async (id_planning) => {
    const { rows } = await db.query(
        'SELECT * FROM evenement WHERE id_planning = $1',
        [id_planning]
    );
    return rows;
};

/**
 * Vérifie s'il existe déjà un événement à la même date/heure
 * sur un planning donné (utile pour éviter les conflits)
 */
exports.existsAtSameTime = async (id_planning, date_, heure) => {
    const { rows } = await db.query(
        `SELECT e.id_evenement
         FROM evenement e
         JOIN planning p ON p.id_planning = e.id_planning
         WHERE p.id_planning = $1
           AND p.date_ = $2
           AND p.heure = $3`,
        [id_planning, date_, heure]
    );

    return rows.length > 0;
};

/**
 * Crée un événement
 * @param {Object} evenement
 * @returns {Promise<Object>}
 */
exports.create = async (evenement) => {
    const {
        titre,
        description,
        id_planning
    } = evenement;

    const { rows } = await db.query(
        `INSERT INTO evenement (titre, description, id_planning)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [titre, description, id_planning]
    );

    return rows[0];
};

/**
 * Met à jour un événement
 */
exports.update = async (id_evenement, updates) => {
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
        `UPDATE evenement SET ${fields.join(', ')}
         WHERE id_evenement = $${index}
         RETURNING *`,
        [...values, id_evenement]
    );

    return rows[0];
};

/**
 * Supprime un événement
 */
exports.delete = async (id_evenement) => {
    const result = await db.query(
        'DELETE FROM evenement WHERE id_evenement = $1',
        [id_evenement]
    );
    return result.rowCount > 0;
};
