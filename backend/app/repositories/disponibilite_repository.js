const db = require('../driver_connex_db');

exports.findAll = async () => {
    const { rows } = await db.query('SELECT * FROM disponibilite');
    return rows;
};