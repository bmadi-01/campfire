const express = require('express');
const router = express.Router();
const disponibiliteController = require('../controllers/disponibilite_controller');
const { authenticate } = require('../middlewares/auth_jwt_middleware');
const { requireEventAccess } = require('../middlewares/requireEventAccess');

router.post('/:id_evenement/invitations', authenticate, requireEventAccess('write'),
    disponibiliteController.invite
);
router.post('/:id_evenement/reponse', authenticate, requireEventAccess('read'),
    disponibiliteController.respond
);
router.put('/:id_evenement', authenticate, requireEventAccess('read'),
    disponibiliteController.update
);
router.delete('/:id_evenement/:id_identite', authenticate, requireEventAccess('write'),
    disponibiliteController.delete
);

module.exports = router;
