const db = require('../driver_connex_db');

exports.findAll = async () => {
    const { rows } = await db.query('SELECT * FROM possede');
    return rows;
};

/**
 * Lie un planning à un groupe
 * (ex: planning public ou privé du groupe)
 */
exports.addPlanningToGroupe = async (id_groupe, id_planning) => {
    const { rows } = await db.query(
        `INSERT INTO possede (id_groupe, id_planning)
         VALUES ($1, $2)
         RETURNING *`,
        [id_groupe, id_planning]
    );
    return rows[0];
};

/**
 * Récupère tous les plannings d’un groupe
 */
exports.findPlanningsByGroupe = async (id_groupe) => {
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
 * Vérifie si un planning appartient à un groupe
 */
exports.exists = async (id_groupe, id_planning) => {
    const { rows } = await db.query(
        `SELECT 1
         FROM possede
         WHERE id_groupe = $1 AND id_planning = $2`,
        [id_groupe, id_planning]
    );
    return rows.length > 0;
};

/**
 * Supprime le lien entre un groupe et un planning
 */
exports.removePlanningFromGroupe = async (id_groupe, id_planning) => {
    const result = await db.query(
        `DELETE FROM possede
         WHERE id_groupe = $1 AND id_planning = $2`,
        [id_groupe, id_planning]
    );
    return result.rowCount > 0;
};

/**
 * Supprime tous les plannings liés à un groupe
 * (ex: suppression du groupe)
 */
exports.removeAllPlanningsFromGroupe = async (id_groupe) => {
    const result = await db.query(
        `DELETE FROM possede WHERE id_groupe = $1`,
        [id_groupe]
    );
    return result.rowCount;
};