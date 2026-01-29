const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role_controllers');

router.get('/', roleController.getRoles);

module.exports = router;
