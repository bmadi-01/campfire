const { Pool } = require('pg');

const pool = new Pool({
    port:5432,
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || '4336.Bmadi?@1',
    database: process.env.DATABASE_NAME || 'campfire-dataBase',
    ssl: false
});
// Test de connexion au demarrage
pool.connect()
    .then(client => {
        console.log('Connected to the database postgreSQL');
        client.release()
    }).catch(err =>{
        console.error('Error connecting to the database postgreSQL', err);
    });
module.exports = pool;