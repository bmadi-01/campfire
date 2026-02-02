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
        cle_dfa = null
    } = userData;

    // 1️ Vérifier si l'utilisateur existe
    const existingUser = await utilisateurRepository.findByEmail(email);
    if (existingUser) {
        throw new Error('Un utilisateur avec cet email existe déjà');
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
    // 1️ Vérifier l'existence de l'utilisateur
    const utilisateur = await utilisateurRepository.findByEmail(email);
    if (!utilisateur || !utilisateur.actif) {
        throw new Error('Email ou mot de passe incorrect');
    }

    // 2️ Vérifier le mot de passe
    const isPasswordValid = await passwordUtils.verifyPassword(
        mot_de_passe,
        utilisateur.mot_de_passe
    );

    if (!isPasswordValid) {
        throw new Error('Email ou mot de passe incorrect');
    }

    // 3️ Récupérer le rôle
    const role = await roleRepository.findById(utilisateur.id_role);
    if (!role) {
        throw new Error('Rôle utilisateur introuvable');
    }

    // 4️ Générer le JWT
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
            role: role.nom
        },
        token
    };
};
