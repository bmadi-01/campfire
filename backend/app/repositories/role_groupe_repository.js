// backend/app/repositories/role_groupe_repository.js
const db = require('../driver_connex_db');

/**
 * Associe une identité à un groupe avec un niveau
 * (organisateur, membre, invité, etc.)
 */
exports.addToGroupe = async ({ id_groupe, id_identite, id_level }) => {
    const { rows } = await db.query(
        `INSERT INTO role_groupe (id_groupe, id_identite, id_level)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [id_groupe, id_identite, id_level]
    );
    return rows[0];
};

/**
 * Récupère le rôle d’une identité dans un groupe
 */
exports.findOne = async (id_groupe, id_identite) => {
    const { rows } = await db.query(
        `SELECT rg.*, l.nom AS level_nom
         FROM role_groupe rg
         JOIN level l ON l.id_level = rg.id_level
         WHERE rg.id_groupe = $1 AND rg.id_identite = $2`,
        [id_groupe, id_identite]
    );
    return rows[0] || null;
};

/**
 * Liste tous les membres d’un groupe avec leur niveau
 */
exports.findByGroupe = async (id_groupe) => {
    const { rows } = await db.query(
        `SELECT 
            rg.id_groupe,
            rg.id_identite,
            l.nom AS niveau,
            i.nom AS identite_nom,
            u.email
         FROM role_groupe rg
         JOIN level l ON l.id_level = rg.id_level
         JOIN identite i ON i.id_identite = rg.id_identite
         JOIN utilisateur u ON u.id_utilisateur = i.id_utilisateur
         WHERE rg.id_groupe = $1`,
        [id_groupe]
    );
    return rows;
};

/**
 * Change le niveau d’un membre dans un groupe
 */
exports.updateLevel = async (id_groupe, id_identite, id_level) => {
    const { rows } = await db.query(
        `UPDATE role_groupe
         SET id_level = $3
         WHERE id_groupe = $1 AND id_identite = $2
         RETURNING *`,
        [id_groupe, id_identite, id_level]
    );
    return rows[0];
};

/**
 * Retire une identité d’un groupe
 */
exports.removeFromGroupe = async (id_groupe, id_identite) => {
    const result = await db.query(
        `DELETE FROM role_groupe
         WHERE id_groupe = $1 AND id_identite = $2`,
        [id_groupe, id_identite]
    );
    return result.rowCount > 0;
};
