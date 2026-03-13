// backend/app/middlewares/requireEventAccess.js
const evenementRepository = require('../repositories/evenement_repository');
const planningRepository = require('../repositories/planning_repository');
const possedeRepository = require('../repositories/possede_repository');
const identiteRepository = require('../repositories/identite_repository');
const roleGroupeRepository = require('../repositories/role_groupe_repository');

/**
 * Middleware : contrôle d'accès à un événement
 * @param {'read'|'write'} mode
 */
exports.requireEventAccess = (mode = 'read') => {
    return async (req, res, next) => {
        try {
            const id_evenement =
                req.params.id_evenement ||
                req.body.id_evenement;

            if (!id_evenement) {
                return res.status(400).json({
                    message: 'id_evenement requis'
                });
            }

            const evenement = await evenementRepository.findById(id_evenement);
            if (!evenement) {
                return res.status(404).json({
                    message: 'Événement introuvable'
                });
            }

            const planning = await planningRepository.findById(evenement.id_planning);
            if (!planning) {
                return res.status(500).json({
                    message: 'Planning lié introuvable'
                });
            }

            // Lecture publique
            if (planning.public && mode === 'read') {
                req.eventContext = {
                    id_evenement,
                    access: 'public'
                };
                return next();
            }

            // Auth requise à partir d’ici
            if (!req.user) {
                return res.status(401).json({
                    message: 'Authentification requise pour la creation evenement'
                });
            }

            // ÉVÉNEMENT PERSONNEL
            if (planning.id_utilisateur) {
                if (planning.id_utilisateur !== req.user.id) {
                    return res.status(403).json({
                        message: 'Accès refusé (événement personnel)'
                    });
                }

                req.eventContext = {
                    id_evenement,
                    type: 'personnel'
                };
                return next();
            }

            // ÉVÉNEMENT DE GROUPE
            const id_identite = req.body.id_identite;

            if (!id_identite) {
                return res.status(400).json({
                    message: 'id_identite requis pour événement de groupe'
                });
            }

            const identite = await identiteRepository.findById(id_identite);
            if (!identite || identite.id_utilisateur !== req.user.id) {
                return res.status(403).json({
                    message: 'Identité invalide'
                });
            }

            const lienGroupe = await possedeRepository.findGroupeByPlanning(
                planning.id_planning
            );

            if (!lienGroupe) {
                return res.status(500).json({
                    message: 'Événement non lié à un groupe'
                });
            }

            const roleGroupe = await roleGroupeRepository.findOne(
                lienGroupe.id_groupe,
                id_identite
            );

            if (!roleGroupe) {
                return res.status(403).json({
                    message: 'Accès refusé : non membre du groupe'
                });
            }

            // Modification réservée aux ORGANISATEURS
            if (mode === 'write' && roleGroupe.level_nom !== 'ORGANISATEUR') {
                return res.status(403).json({
                    message: 'Modification réservée aux organisateurs'
                });
            }

            req.eventContext = {
                id_evenement,
                id_groupe: lienGroupe.id_groupe,
                id_identite,
                level: roleGroupe.level_nom
            };

            next();

        } catch (error) {
            next(error);
        }
    };
};
