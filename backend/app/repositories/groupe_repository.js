// backend/app/repositories/groupe_repository.js
const db = require('../driver_connex_db');

/**
 * Récupère tous les groupes
 * @returns {Promise<Array>} - liste de tous les groupes
 */
exports.findAll = async () => {
    const { rows } = await db.query('SELECT * FROM groupe');
    return rows;
};

/**
 * Récupère un groupe par son ID
 * @param {number} id_groupe
 * @returns {Promise<Object|null>} - groupe ou null si inexistant
 */
exports.findById = async (id_groupe) => {
    const { rows } = await db.query(
        'SELECT * FROM groupe WHERE id_groupe = $1',
        [id_groupe]
    );
    return rows[0] || null;
};

/**
 * Récupère un groupe par son nom
 * @param {string} nom
 * @returns {Promise<Object|null>} - groupe ou null si inexistant
 */
exports.findByName = async (nom) => {
    const { rows } = await db.query(
        'SELECT * FROM groupe WHERE nom = $1',
        [nom]
    );
    return rows[0] || null;
};

/**
 * Crée un nouveau groupe
 * @param {Object} groupe - { nom, description, date_creation }
 * @returns {Promise<Object>} - groupe créé
 */
exports.create = async (groupe) => {
    const { nom, description, date_creation } = groupe;
    const { rows } = await db.query(
        `INSERT INTO groupe (nom, description, date_creation)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [nom, description, date_creation || new Date()]
    );
    return rows[0];
};

/**
 * Met à jour un groupe
 * @param {number} id_groupe
 * @param {Object} updates - { nom?, description?, date_creation? }
 * @returns {Promise<Object|null>} - groupe mis à jour ou null si aucun champ
 */
exports.update = async (id_groupe, updates) => {
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
        `UPDATE groupe SET ${fields.join(', ')} WHERE id_groupe = $${index} RETURNING *`,
        [...values, id_groupe]
    );

    return rows[0];
};

/**
 * Supprime un groupe
 * @param {number} id_groupe
 * @returns {Promise<boolean>} - true si supprimé
 */
exports.delete = async (id_groupe) => {
    const result = await db.query(
        'DELETE FROM groupe WHERE id_groupe = $1',
        [id_groupe]
    );
    return result.rowCount > 0;
};
