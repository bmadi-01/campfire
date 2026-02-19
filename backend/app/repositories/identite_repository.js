// backend/app/repositories/identite_repository.js
const db = require('../driver_connex_db');

/**
 * Crée une identité pour un utilisateur
 * (ex: identité dans un groupe, organisation, etc.)
 */
exports.create = async ({ nom, id_utilisateur }) => {
    const { rows } = await db.query(
        `INSERT INTO identite (nom, id_utilisateur)
         VALUES ($1, $2)
         RETURNING *`,
        [nom, id_utilisateur]
    );
    return rows[0];
};

/**
 * Trouve une identité par son ID
 */
exports.findById = async (id_identite) => {
    const { rows } = await db.query(
        'SELECT * FROM identite WHERE id_identite = $1',
        [id_identite]
    );
    return rows[0] || null;
};

/**
 * Récupère toutes les identités d’un utilisateur
 */
exports.findByUtilisateur = async (id_utilisateur) => {
    const { rows } = await db.query(
        'SELECT * FROM identite WHERE id_utilisateur = $1',
        [id_utilisateur]
    );
    return rows;
};

/**
 * Récupère les identités liées à un groupe
 * (via role_groupe)
 */
exports.findByGroupe = async (id_groupe) => {
    const { rows } = await db.query(
        `SELECT i.*
         FROM identite i
         JOIN role_groupe rg ON rg.id_identite = i.id_identite
         WHERE rg.id_groupe = $1`,
        [id_groupe]
    );
    return rows;
};

/**
 * IDENTITÉS ASSIGNÉES OU NON
 */
exports.findWithGroupStatus = async (userId) => {
    const { rows } = await db.query(`
        SELECT i.*,
        EXISTS (
            SELECT 1
            FROM role_groupe rg
            WHERE rg.id_identite = i.id_identite
        ) AS assigned
        FROM identite i
        WHERE i.id_utilisateur = $1
    `, [userId]);

    return rows;
};

/**
 * Met à jour le nom d’une identité
 */
exports.update = async (id_identite, updates) => {
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
        `UPDATE identite
         SET ${fields.join(', ')}
         WHERE id_identite = $${index}
         RETURNING *`,
        [...values, id_identite]
    );

    return rows[0];
};

/**
 * Supprime une identité
 * ⚠️ Attention : cascade logique à gérer côté service
 */
exports.delete = async (id_identite) => {
    const result = await db.query(
        'DELETE FROM identite WHERE id_identite = $1',
        [id_identite]
    );
    return result.rowCount > 0;
};
