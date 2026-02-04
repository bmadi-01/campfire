const express = require('express');
const router = express.Router();
const roleGroupeController = require('../controllers/role_groupe_controller');

const {authenticate} = require('../middlewares/auth_jwt_middleware');
const {requireGroupMember} = require('../middlewares/requireGroupMember');
const {requireGroupOrganisateur} = require('../middlewares/requireGroupOrganisateur');

router.get('/:id_groupe/members', authenticate,requireGroupMember,roleGroupeController.getMembers);
router.put('/:id_groupe/members/:id_identite',authenticate,requireGroupMember,requireGroupOrganisateur,roleGroupeController.updateRole);
router.delete('/:id_groupe/members/:id_identite', authenticate, requireGroupMember, requireGroupOrganisateur,roleGroupeController.remove);

module.exports = router;