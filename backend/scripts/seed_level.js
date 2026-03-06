// backend/scripts/seed_level.js
// require('dotenv').config();
const db = require('../app/driver_connex_db');

const LEVELS = [
    { nom: 'ORGANISATEUR' },
    { nom: 'MEMBRE' },
    { nom: 'INVITE' }
];

async function seedLevels() {
    try {
        console.log('🧩 Seed des niveaux (levels) en cours...');

        for (const level of LEVELS) {
            const { rows } = await db.query(
                'SELECT id_level FROM level WHERE nom = $1',
                [level.nom]
            );

            if (rows.length === 0) {
                await db.query(
                    'INSERT INTO level (nom) VALUES ($1)',
                    [level.nom]
                );

                console.log(`\x1b[32mLevel créé : ${level.nom}\x1b[0m`);
            } else {
                console.log(`\x1b[34mLevel déjà existant : ${level.nom}\x1b[0m`);
            }
        }

        console.log('Seed des levels terminé');
        process.exit(0);

    } catch (error) {
        console.error(`\x1b[31mErreur seed levels : ${error.message}\x1b[0m`);
        process.exit(1);
    }
}

seedLevels();
