const express = require('express');
const router = express.Router();
const possedeController = require('../controllers/possede_controller');
const { authenticate } = require('../middlewares/auth_jwt_middleware');
const { requireGroupOrganisateur } = require('../middlewares/requireGroupOrganisateur');

router.get('/group/:id_groupe', authenticate, possedeController.getPlanningsByGroup);
router.post('/group/:id_groupe', authenticate, requireGroupOrganisateur, possedeController.attachPlanning);
router.delete('/group/:id_groupe/:id_planning', authenticate, requireGroupOrganisateur, possedeController.detachPlanning);

module.exports = router;
