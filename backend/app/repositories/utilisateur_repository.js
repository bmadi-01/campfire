const db = require("../driver_connex_db");

/**
 * Trouve un Utilisateur par son email
 * @param {string} email - addresse mail de l'utisateur
 * @returns {promise<Object|null>} - l'utilisateur ou null si non trouvé
 */

exports.findByEmail = async (email) => {
    const {rows} = await db.query(
        `SELECT * FROM utilisateur WHERE email = $1`, [email]
    );
    return rows[0] || null;
}

/**
 * Trouve un utilisateur par sont ID
 * @param {number} id_utilisateur - identifient de l'utilisateur
 * @returns {promise<Object|null>} -l'utilisateur ou null si non trouvé
 */
exports.findById =  async (id_utilisateur) => {
    const {rows} = await db.query(
        `SELECT * FROM utilisateur WHERE id_utilisateur = $1`, [id_utilisateur]);
    return rows[0];
};

/**
 * Crée un nouvel utilisateur
 * @param {Object} user - {prenom, pseudo, email, mot_de_passe, ip_cgu, date_cgu, cle_dfa, id_role}
 * @returns {promise<Object>} {id, eamil}
 */
exports.create = async (user) => {
    const {prenom, pseudo, email, mot_de_passe, ip_cgu, date_cgu, cle_dfa, id_role} = user;
    const {rows} = await db.query(
        `INSERT INTO utilisateur 
            (prenom, pseudo, email, mot_de_passe, date_creation,actif, ip_cgu, date_cgu, cle_dfa, id_role) 
        VALUES ($1, $2, $3, $4, NOW(), true, $5, $6, $7, $8)
             RETURNING id_utilisateur, email`, [prenom, pseudo, email, mot_de_passe, ip_cgu, date_cgu, cle_dfa, id_role]
        );
    return rows[0];
};

/**
 * Met a jour un utilisateur
 * @param{number} id_utilisateur
 * @param {Object} updates - { prenom?, pseudo?, email?, mot_de_passe?, actif? }
 * @returns {Promise<Object>} l'utilisateur mis à jour
 */
exports.update = async (id_utilisateur, updates) => {
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
        `UPDATE utilisateur SET ${fields.join(', ')} WHERE id_utilisateur = $${index} RETURNING *`, [...values, id_utilisateur]
    );

    return rows[0];
};
/**
 * Supprime un utilisateur
 * @param {number} id_utilisateir
 * @returns {Promise<boolean>} true si supprimé
 */

exports.delete = async (id_utilisateur) => {
    const result = await db.query(
        'DELETE FROM utilisateur WHERE id_utilisateur = $1', [id_utilisateur]

);
    return result.rowCount > 0;
};

