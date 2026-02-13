const express =  require('express');
const router = express.Router();
const groupeController = require('../controllers/groupe_controller');

const { authenticate } = require('../middlewares/auth_jwt_middleware');
const {authorize} = require('../middlewares/authorizeRoles');
const {requireGroupMember} = require('../middlewares/requireGroupMember');
const {requireGroupOrganisateur} = require('../middlewares/requireGroupOrganisateur');

router.post('/',authenticate,authorize('USER','ADMIN'),groupeController.create);
router.get('/',authenticate, authorize('USER','ADMIN'), groupeController.getMyGroups);
router.get('/:id_groupe',authenticate,requireGroupMember,groupeController.getById);
router.delete('/:id_groupe',authenticate,requireGroupMember,requireGroupOrganisateur,groupeController.delete);

module.exports = router;