const db = require('../driver_connex_db');

exports.findAll = async () => {
    const { rows } = await db.query('SELECT * FROM possede');
    return rows;
};

/**
 * Alias MÉTIER → utilisé par le service
 */
exports.create = async ({ id_groupe, id_planning }) => {
    await db.query(
        `
        INSERT INTO possede (id_groupe, id_planning)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        `,
        [id_groupe, id_planning]
    );

    return { id_groupe, id_planning };
};

/**
 * Alias MÉTIER → utilisé par le service
 */
exports.delete = async (id_groupe, id_planning) => {
    const result = await db.query(
        `
        DELETE FROM possede
        WHERE id_groupe = $1 AND id_planning = $2
        `,
        [id_groupe, id_planning]
    );

    return result.rowCount > 0;
};

/**
 * Fonctions métier explicites (conservées)
 */
exports.addPlanningToGroupe = exports.create;

exports.removePlanningFromGroupe = exports.delete;

/**
 * Vérifie si un planning appartient à un groupe
 */
exports.exists = async (id_groupe, id_planning) => {
    const { rows } = await db.query(
        `
        SELECT 1
        FROM possede
        WHERE id_groupe = $1 AND id_planning = $2
        `,
        [id_groupe, id_planning]
    );
    return rows.length > 0;
};

/**
 * Récupère tous les plannings d’un groupe
 */
exports.findPlanningsByGroupe = async (id_groupe) => {
    const { rows } = await db.query(
        `
        SELECT p.*
        FROM planning p
        JOIN possede po ON po.id_planning = p.id_planning
        WHERE po.id_groupe = $1
        `,
        [id_groupe]
    );
    return rows;
};

/**
 * Supprime tous les liens planning ↔ groupe
 * (suppression du groupe)
 */
exports.removeAllPlanningsFromGroupe = async (id_groupe) => {
    const result = await db.query(
        `DELETE FROM possede WHERE id_groupe = $1`,
        [id_groupe]
    );
    return result.rowCount;
};
