// backend/app/repositories/evenement_repository.js
const db = require('../driver_connex_db');

/**
 * Récupère tous les événements
 */
exports.findAll = async () => {
    const { rows } = await db.query(
        'SELECT * FROM evenement'
    );
    return rows;
};

/**
 * Récupère un événement par ID
 */
exports.findById = async (id_evenement) => {
    const { rows } = await db.query(
        'SELECT * FROM evenement WHERE id_evenement = $1',
        [id_evenement]
    );
    return rows[0] || null;
};

/**
 * Récupère les événements d'un planning
 */
exports.findByPlanning = async (id_planning) => {
    const { rows } = await db.query(
        'SELECT * FROM evenement WHERE id_planning = $1',
        [id_planning]
    );
    return rows;
};

/**
 * Vérifie s’il existe un conflit de date pour un planning grégorien.
 *
 * Conflit si :
 * - un événement commence dans un intervalle déjà occupé
 * - ou chevauche un événement existant
 *
 * @param {number} id_planning
 * @param {Date|string} date_debut
 * @param {Date|string|null} date_fin
 * @returns {boolean}
 */
exports.existsGregorianConflict = async (
    id_planning,
    date_debut,
    date_fin = null
) => {

    const { rows } = await db.query(
        `
        SELECT 1
        FROM evenement
        WHERE id_planning = $1
          AND date_debut IS NOT NULL
          AND (
                (date_debut <= $2 AND (date_fin IS NULL OR date_fin > $2))
             OR ($3 IS NOT NULL AND date_debut < $3)
          )
        LIMIT 1
        `,
        [id_planning, date_debut, date_fin]
    );

    return rows.length > 0;
};

/**
 * Vérifie s’il existe un conflit pour un planning diégétique.
 *
 * Conflit si un événement existe déjà
 * à la même date et même heure.
 *
 * @param {number} id_planning
 * @param {number} annee
 * @param {number} mois
 * @param {number} jour
 * @param {number|null} heure
 * @param {number|null} minute
 * @returns {boolean}
 */
exports.existsDiegeticConflict = async (
    id_planning,
    annee,
    mois,
    jour,
    heure = null,
    minute = null
) => {

    const { rows } = await db.query(
        `
        SELECT 1
        FROM evenement
        WHERE id_planning = $1
          AND annee = $2
          AND mois = $3
          AND jour = $4
          AND (
                (heure = $5 AND minute = $6)
             OR ($5 IS NULL)
          )
        LIMIT 1
        `,
        [
            id_planning,
            annee,
            mois,
            jour,
            heure,
            minute
        ]
    );

    return rows.length > 0;
};


/**
 * Crée un événement
 * @param {Object} evenement
 * @returns {Promise<Object>}
 */
exports.create = async (evenement) => {

    const {
        titre,
        description,
        id_planning,
        date_debut = null,
        date_fin = null,
        annee = null,
        mois = null,
        jour = null,
        heure = null,
        minute = null
    } = evenement;

    const { rows } = await db.query(
        `
            INSERT INTO evenement (
                titre,
                description,
                id_planning,
                date_debut,
                date_fin,
                annee,
                mois,
                jour,
                heure,
                minute
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
                RETURNING *
        `,
        [
            titre,
            description,
            id_planning,
            date_debut,
            date_fin,
            annee,
            mois,
            jour,
            heure,
            minute
        ]
    );

    return rows[0];
};

/**
 * Met à jour un événement
 */
exports.update = async (id_evenement, updates) => {
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
        `UPDATE evenement SET ${fields.join(', ')}
         WHERE id_evenement = $${index}
         RETURNING *`,
        [...values, id_evenement]
    );

    return rows[0];
};

/**
 * Supprime un événement
 */
exports.delete = async (id_evenement) => {
    const result = await db.query(
        'DELETE FROM evenement WHERE id_evenement = $1',
        [id_evenement]
    );
    return result.rowCount > 0;
};
