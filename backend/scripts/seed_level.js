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

                console.log(`✅ Level créé : ${level.nom}`);
            } else {
                console.log(`ℹ️ Level déjà existant : ${level.nom}`);
            }
        }

        console.log('🎉 Seed des levels terminé');
        process.exit(0);

    } catch (error) {
        console.error('❌ Erreur seed levels :', error.message);
        process.exit(1);
    }
}

seedLevels();
