// backend/app/services/auth_service.js
const utilisateurRepository = require('../repositories/utilisateur_repository');
const roleRepository = require('../repositories/role_repository');
const passwordUtils = require('../utils/password');
const jwtUtils = require('../utils/jwt');

/**
 * Inscription d'un utilisateur
 */
exports.register = async (userData) => {
    const {
        prenom,
        pseudo,
        email,
        mot_de_passe,
        ip_cgu,
        date_cgu,
        cle_dfa = null,
    } = userData;

    if (!mot_de_passe || !email || !prenom) {
        throw new Error('Champs obligatoires manquants prenom, email, mot de passe etc...');
    }

    // 1️ Vérifier si l'utilisateur existe
    const existingUser = await utilisateurRepository.findByEmail(email);
    if (existingUser) {
        const error = new Error('Un utilisateur avec cet email existe déjà');
        error.statusCode = 409;
        throw error;
    }

    // 2 Récupérer le rôle USER
    const roleUser = await roleRepository.findByName('USER');
    if (!roleUser) {
        throw new Error('Rôle USER introuvable en base');
    }

    // 3️ Hasher le mot de passe
    const hashedPassword = await passwordUtils.hashPassword(mot_de_passe);

    // 4️ Créer l'utilisateur
    const user = await utilisateurRepository.create({
        prenom,
        pseudo,
        email,
        mot_de_passe: hashedPassword,
        ip_cgu,
        date_cgu,
        cle_dfa,
        id_role: roleUser.id_role
    });

    // 5️ Générer le JWT (payload cohérent)
    const token = jwtUtils.signToken({
        id: user.id_utilisateur,
        email: user.email,
        role: roleUser.nom
    });

    return {
        utilisateur: {
            id: user.id_utilisateur,
            email: user.email,
            pseudo: user.pseudo,
            role: roleUser.nom
        },
        token
    };
};

/**
 * Connexion utilisateur
 */
exports.login = async (email, mot_de_passe) => {
    const utilisateur = await utilisateurRepository.findByEmail(email);
    if (!utilisateur) {
        throw new Error('Email ou mot de passe incorrect');
    }

    if (!utilisateur.actif) {
        throw new Error('Compte désactivé');
    }

    const isPasswordValid = await passwordUtils.verifyPassword(
        mot_de_passe,
        utilisateur.mot_de_passe
    );

    if (!isPasswordValid) {
        throw new Error('Email ou mot de passe incorrect');
    }

    //  Récupérer le rôle COMPLET
    const role = await roleRepository.findById(utilisateur.id_role);
    if (!role) {
        throw new Error('Rôle utilisateur introuvable');
    }

    //  Générer le JWT avec le NOM du rôle
    const token = jwtUtils.signToken({
        id: utilisateur.id_utilisateur,
        email: utilisateur.email,
        role: role.nom
    });

    return {
        utilisateur: {
            id: utilisateur.id_utilisateur,
            email: utilisateur.email,
            pseudo: utilisateur.pseudo,
            prenom: utilisateur.prenom,
            role: role.nom
        },
        token
    };
};
