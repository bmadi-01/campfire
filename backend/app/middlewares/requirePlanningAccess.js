const planningRepository = require('../repositories/planning_repository');
const possedeRepository = require('../repositories/possede_repository');
const roleGroupeRepository = require('../repositories/role_groupe_repository');
const identiteRepository = require('../repositories/identite_repository');

/**
 * Middleware : contrôle d'accès à un planning
 * @param {'read'|'write'} mode
 */
exports.requirePlanningAccess = (mode = 'read') => {
    return async (req, res, next) => {
        try {
            const id_planning =
                req.params.id_planning ||
                req.body.id_planning;

            if (!id_planning) {
                return res.status(400).json({
                    message: 'id_planning requis'
                });
            }

            const planning = await planningRepository.findFullById(id_planning);
            if (!planning) {
                return res.status(404).json({
                    message: 'Planning introuvable'
                });
            }

            // 🔓 PLANNING PUBLIC → lecture libre
            if (planning.public && mode === 'read') {
                req.planningContext = {
                    id_planning,
                    access: 'public'
                };
                return next();
            }

            // 🔒 Auth obligatoire à partir d’ici
            if (!req.user) {
                return res.status(401).json({
                    message: 'Authentification requise'
                });
            }

            // 🧍 PLANNING PERSONNEL
            if (planning.id_utilisateur) {
                if (planning.id_utilisateur !== req.user.id) {
                    return res.status(403).json({
                        message: 'Accès refusé (planning personnel)'
                    });
                }

                req.planningContext = {
                    id_planning,
                    owner: true
                };
                return next();
            }

            // 👥 PLANNING DE GROUPE
            const id_identite =
                req.body.id_identite ||
                req.query.id_identite;

            if (mode === 'write' && !id_identite) {
                return res.status(400).json({
                    message: 'id_identite requis pour planning de groupe'
                });
            }

            const identite = await identiteRepository.findById(id_identite);
            if (!identite || identite.id_utilisateur !== req.user.id) {
                return res.status(403).json({
                    message: 'Identité invalide'
                });
            }

            const lienGroupe = await possedeRepository.findGroupeByPlanning(id_planning);
            if (!lienGroupe) {
                return res.status(403).json({
                    message: 'Planning non lié à un groupe'
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

            // ✏️ Écriture réservée aux ORGANISATEURS
            if (mode === 'write' && roleGroupe.level_nom !== 'ORGANISATEUR') {
                return res.status(403).json({
                    message: 'Modification réservée aux organisateurs'
                });
            }

            req.planningContext = {
                id_planning,
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
