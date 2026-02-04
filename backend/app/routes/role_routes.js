const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role_controllers');

router.get('/', roleController.getAll);
router.get('/:id_role', roleController.getById);

module.exports = router;
