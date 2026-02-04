const db = require('../driver_connex_db');

exports.findAll = async () => {
    const { rows } = await db.query('SELECT * FROM role');
    return rows;
};

/**
 * Trouver un rôle par son nom
 */

exports.findByName = async (nom) => {
    const { rows } = await db.query(
        'SELECT * FROM role WHERE nom = $1',
        [nom]
    );
    return rows[0] || null;
};

/**
 * Trouve un un rôle par son ID
 */
exports.findById = async(id_role) => {
    const { rows } = await db.query(
        'SELECT * FROM role WHERE id_role = $1',[id_role]
    );
    return rows[0] || null;
}

/**
 * Crée un rôle via le script backend/scripts/sedd_...
 * @param {Object} role - {nom, description}
 * @returns {Promise<Object>} rôle créé
 */
exports.create = async (role) => {
    const { nom, description } = role;
    const { rows } = await db.query(
        'INSERT INTO role (nom, description) VALUES ($1, $2) RETURNING *',
        [nom, description]
    );
    return rows[0];
};

/**
 * Supprime un rôle global par son ID
 * @param {number} id_role
 * @returns {Promise<boolean>} true si supprimé
 */
exports.delete = async (id_role) => {
    const result = await db.query(
        `
        DELETE FROM role
        WHERE id_role = $1
        `,
        [id_role]
    );

    return result.rowCount > 0;
};
