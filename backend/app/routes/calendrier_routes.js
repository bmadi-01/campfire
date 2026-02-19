const express = require('express');
const router = express.Router();
const calendrierController = require('../controllers/calendrier_controller');
const { authenticate } = require('../middlewares/auth_jwt_middleware');
const { authorize } = require('../middlewares/authorizeRoles');

router.get('/', calendrierController.getAll);
router.get('/:id_calendrier', calendrierController.getById);

/**
 * ❌ Optionnel : supprimer POST
 * Car les moteurs sont fixes (seed)
 */
// router.post('/', authenticate, authorize('ADMIN'), calendrierController.create);

/**
 * ❌ Optionnel : empêcher suppression
 * On ne veut pas supprimer GREGORIEN ou DIEGETIQUE
 */
// router.delete('/:id_calendrier', authenticate, authorize('ADMIN'), calendrierController.delete);

// Nouvelle mise à jour dans la base de donnée
// Parce que : TODO = CHECK (type IN ('GREGORIEN','DIEGETIQUE'))

//Donc : Il n’y aura jamais plus de deux moteurs
//Ce sont des constants systèmes
// Ce n’est pas un objet métier dynamique.

module.exports = router;
