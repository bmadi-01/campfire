// backend/app/repositories/presence_repository.js
const db = require('../driver_connex_db');

/**
 * Récupère tous les états de présence
 * (présent, absent, peut-être)
 */
exports.findAll = async () => {
    const { rows } = await db.query(
        'SELECT * FROM presence ORDER BY id_presence'
    );
    return rows;
};

/**
 * Trouve un état de présence par son ID
 */
exports.findById = async (id_presence) => {
    const { rows } = await db.query(
        'SELECT * FROM presence WHERE id_presence = $1',
        [id_presence]
    );
    return rows[0] || null;
};

/**
 * Trouve un état de présence par son nom
 * ex: "présent", "absent", "peut-être"
 */
exports.findByName = async (nom) => {
    const { rows } = await db.query(
        'SELECT * FROM presence WHERE nom = $1',
        [nom]
    );
    return rows[0] || null;
};

/**
 * Crée un état de présence
 * (utilisé uniquement par un script seed)
 */
exports.create = async ({ nom, background, foreground }) => {
    const { rows } = await db.query(
        `INSERT INTO presence (nom, background, foreground)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [nom, background, foreground]
    );

    return rows[0];
};

/**
 * Met à jour un état de présence
 * (rarement utilisé, admin only)
 */
exports.update = async (id_presence, updates) => {
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
        `UPDATE presence
         SET ${fields.join(', ')}
         WHERE id_presence = $${index}
         RETURNING *`,
        [...values, id_presence]
    );

    return rows[0];
};

/**
 * Supprime un état de présence
 * ⚠️ À éviter en prod (clé métier)
 */
exports.delete = async (id_presence) => {
    const result = await db.query(
        'DELETE FROM presence WHERE id_presence = $1',
        [id_presence]
    );
    return result.rowCount > 0;
};
