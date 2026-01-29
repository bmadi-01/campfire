//require('dotenv').config();
//const db = require('../app/driver_connex_db');

const roleRepository = require('../app/repositories/role_repository');
const utilisateurRepository = require('../app/repositories/utilisateur_repository');
const passwordUtils = require('../app/utils/password');

async function seedRolesAndAdmin() {
    try {
        console.log('Début du seed Campfire...');

        // 1️ Définition des rôles
        const roles = [
            { nom: 'ADMIN', description: 'Administrateur avec tous les droits' },
            { nom: 'USER', description: 'Utilisateur standard' },
            { nom: 'VISITOR', description: 'Visiteur non authentifié' }
        ];

        const roleMap = {};

        // 2️ Création des rôles si absents
        for (const role of roles) {
            let existingRole = await roleRepository.findByName(role.nom);

            if (!existingRole) {
                existingRole = await roleRepository.create(role);
                console.log(`Rôle créé : ${role.nom}`);
            } else {
                console.log(`Rôle déjà existant : ${role.nom}`);
            }

            roleMap[role.nom] = existingRole;
        }

        // 3️ Création de l’admin
        const adminEmail = 'admin@campfire.com';

        const existingAdmin = await utilisateurRepository.findByEmail(adminEmail);

        if (!existingAdmin) {
            const hashedPassword = await passwordUtils.hashPassword('Admin123!');

            await utilisateurRepository.create({
                prenom: 'Admin',
                pseudo: 'admin',
                email: adminEmail,
                mot_de_passe: hashedPassword,
                ip_cgu: '127.0.0.1',
                date_cgu: new Date(),
                cle_dfa: null,
                id_role: roleMap.ADMIN.id_role
            });

            console.log('Admin créé avec succès');
            console.log(`Email : ${adminEmail}`);
            console.log(`Mot de passe : ${hashedPassword}`);
        } else {
            console.log('Admin déjà existant');
        }

        console.log('Seed Campfire terminé avec succès');
        process.exit(0);

    } catch (error) {
        console.error('Erreur lors du seed :', error);
        process.exit(1);
    }
}

seedRolesAndAdmin();
