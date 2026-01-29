const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12

/**
 * Hash un mot de passe avant de le stocker
 * @param {string} password - mot de passe en clair
 * @param {promise<string>} - hash sécurisé
 */
exports.hashPassword = async (password) => {
    if (!password || password.length < 8) {
        throw new Error('Password must be 8  characters');
    }
    return bcrypt.hash(password, SALT_ROUNDS);
};
/**
 * Compare un mot de passe avec un hash
 * @param {string} password - mot de pas en crair
 * @param {string} hash - mot de passe hash stocker en base
 * @returns {promise<boolean>}  - verifie mdp en clair = mdp hash
 */
exports.verifyPassword = async (password,hash) => {
    if (!password || !hash) {
        return false;
    }
    return bcrypt.compare(password, hash);
}