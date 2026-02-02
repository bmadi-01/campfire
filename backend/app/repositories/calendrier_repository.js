// backend/app/repositories/calendrier_repository.js
const db = require('../driver_connex_db');

/**
 * Récupère tous les calendriers
 * (GREGORIEN, DIEGETIQUE)
 */
exports.findAll = async () => {
    const { rows } = await db.query(
        'SELECT * FROM calendrier ORDER BY id_calendrier'
    );
    return rows;
};

/**
 * Trouve un calendrier par son ID
 */
exports.findById = async (id_calendrier) => {
    const { rows } = await db.query(
        'SELECT * FROM calendrier WHERE id_calendrier = $1',
        [id_calendrier]
    );
    return rows[0] || null;
};

/**
 * Trouve un calendrier par son type
 * ex: GREGORIEN | DIEGETIQUE
 */
exports.findByType = async (type_calendrier) => {
    const { rows } = await db.query(
        'SELECT * FROM calendrier WHERE type_calendrier = $1',
        [type_calendrier]
    );
    return rows[0] || null;
};

/**
 * Crée un calendrier
 * (utilisé uniquement par un script seed)
 */
exports.create = async ({ type_calendrier }) => {
    const { rows } = await db.query(
        `INSERT INTO calendrier (type_calendrier)
         VALUES ($1)
         RETURNING *`,
        [type_calendrier]
    );
    return rows[0];
};

/**
 * Met à jour un calendrier
 * (rarement utilisé)
 */
exports.update = async (id_calendrier, updates) => {
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
        `UPDATE calendrier
         SET ${fields.join(', ')}
         WHERE id_calendrier = $${index}
         RETURNING *`,
        [...values, id_calendrier]
    );

    return rows[0];
};

/**
 * Supprime un calendrier
 * ⚠️ À éviter en production (clé métier)
 */
exports.delete = async (id_calendrier) => {
    const result = await db.query(
        'DELETE FROM calendrier WHERE id_calendrier = $1',
        [id_calendrier]
    );
    return result.rowCount > 0;
};
