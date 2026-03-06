const express = require('express');
const router = express.Router();
const possedeController = require('../controllers/possede_controller');
const { authenticate } = require('../middlewares/auth_jwt_middleware');
const { requireGroupMember } = require('../middlewares/requireGroupMember');
const { requireGroupOrganisateur } = require('../middlewares/requireGroupOrganisateur');

router.get('/group/:id_groupe', authenticate, requireGroupMember,
    possedeController.getPlanningsByGroup
);

router.post(
    '/group/:id_groupe', authenticate, requireGroupMember, requireGroupOrganisateur,
    possedeController.attachPlanning
);

router.delete('/group/:id_groupe/:id_planning', authenticate, requireGroupMember, requireGroupOrganisateur,
    possedeController.detachPlanning
);

module.exports = router;
