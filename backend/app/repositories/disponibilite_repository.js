// backend/app/repositories/disponibilite_repository.js
const db = require('../driver_connex_db');

/**
 * Récupère toutes les disponibilités
 */
exports.findAll = async () => {
    const { rows } = await db.query(
        'SELECT * FROM disponibilite'
    );
    return rows;
};

/**
 * Récupère la disponibilité d'une identité pour un événement
 */
exports.findOne = async (id_identite, id_evenement) => {
    const { rows } = await db.query(
        `SELECT * 
         FROM disponibilite
         WHERE id_identite = $1 AND id_evenement = $2`,
        [id_identite, id_evenement]
    );

    return rows[0] || null;
};

/**
 * Récupère toutes les disponibilités d'un événement
 */
exports.findByEvenement = async (id_evenement) => {
    const { rows } = await db.query(
        `SELECT d.*, p.nom AS presence_nom
         FROM disponibilite d
         JOIN presence p ON p.id_presence = d.id_presence
         WHERE d.id_evenement = $1`,
        [id_evenement]
    );

    return rows;
};

/**
 * Récupère toutes les disponibilités d'une identité
 */
exports.findByIdentite = async (id_identite) => {
    const { rows } = await db.query(
        `SELECT d.*, e.titre, p.nom AS presence_nom
         FROM disponibilite d
         JOIN evenement e ON e.id_evenement = d.id_evenement
         JOIN presence p ON p.id_presence = d.id_presence
         WHERE d.id_identite = $1`,
        [id_identite]
    );

    return rows;
};

/**
 * Crée une disponibilité
 * (appelée lors d'une invitation ou d'une réponse)
 */
exports.create = async ({ id_identite, id_evenement, id_presence }) => {
    const { rows } = await db.query(
        `INSERT INTO disponibilite (id_identite, id_evenement, id_presence)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [id_identite, id_evenement, id_presence]
    );

    return rows[0];
};

/**
 * Met à jour la disponibilité (Présent → Absent, etc.)
 */
exports.update = async ({ id_identite, id_evenement, id_presence }) => {
    const { rows } = await db.query(
        `UPDATE disponibilite
         SET id_presence = $3
         WHERE id_identite = $1 AND id_evenement = $2
         RETURNING *`,
        [id_identite, id_evenement, id_presence]
    );

    return rows[0];
};

/**
 * Supprime toutes les disponibilités liées à une identité
 */
exports.deleteByIdentite = async (id_identite) => {
    await db.query(
        'DELETE FROM disponibilite WHERE id_identite = $1',
        [id_identite]
    );
};


/**
 * Supprime une disponibilité
 * (ex : refus d'invitation ou retrait)
 */
exports.delete = async (id_identite, id_evenement) => {
    const result = await db.query(
        `DELETE FROM disponibilite
         WHERE id_identite = $1 AND id_evenement = $2`,
        [id_identite, id_evenement]
    );

    return result.rowCount > 0;
};
