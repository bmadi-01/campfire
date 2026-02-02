// backend/app/repositories/level_repository.js
const db = require('../driver_connex_db');

/**
 * Récupère tous les niveaux
 * Exemple : ORGANISATEUR, MEMBRE, INVITE, VISITOR
 */
exports.findAll = async () => {
    const { rows } = await db.query(
        'SELECT * FROM level ORDER BY id_level'
    );
    return rows;
};

/**
 * Trouve un niveau par son nom
 * @param {string} nom - ex: ORGANISATEUR
 */
exports.findByName = async (nom) => {
    const { rows } = await db.query(
        'SELECT * FROM level WHERE nom = $1',
        [nom]
    );
    return rows[0] || null;
};

/**
 * Trouve un niveau par son ID
 */
exports.findById = async (id_level) => {
    const { rows } = await db.query(
        'SELECT * FROM level WHERE id_level = $1',
        [id_level]
    );
    return rows[0] || null;
};

/**
 * Crée un niveau (seed / admin uniquement)
 */
exports.create = async ({ nom }) => {
    const { rows } = await db.query(
        'INSERT INTO level (nom) VALUES ($1) RETURNING *',
        [nom]
    );
    return rows[0];
};

/**
 * Supprime un niveau (⚠️ très rare)
 */
exports.delete = async (id_level) => {
    const result = await db.query(
        'DELETE FROM level WHERE id_level = $1',
        [id_level]
    );
    return result.rowCount > 0;
};
