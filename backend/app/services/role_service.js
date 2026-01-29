const roleRepo = require('../repositories/role_repository');

exports.getAllRoles = async () => {
    return roleRepo.findAll();
};


