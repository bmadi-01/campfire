// backend/scripts/seed_presence.js
// require('dotenv').config();
const db = require('../app/driver_connex_db');

const PRESENCES = [
    {
        nom: 'PRESENT',
        background: '#4CAF50',   // vert
        foreground: '#FFFFFF'
    },
    {
        nom: 'ABSENT',
        background: '#F44336',   // rouge
        foreground: '#FFFFFF'
    },
    {
        nom: 'PEUT_ETRE',
        background: '#FF9800',   // orange
        foreground: '#000000'
    }
];

async function seedPresence() {
    try {
        console.log('Seed des présences en cours...');

        for (const presence of PRESENCES) {
            const { rows } = await db.query(
                'SELECT id_presence FROM presence WHERE nom = $1',
                [presence.nom]
            );

            if (rows.length === 0) {
                await db.query(
                    `INSERT INTO presence (nom, background, foreground)
                     VALUES ($1, $2, $3)`,
                    [presence.nom, presence.background, presence.foreground]
                );

                console.log(`\x1b[31mPrésence créée : ${presence.nom}\x1b[0m`);
            } else {
                console.log(`\x1b[31mPrésence déjà existante : ${presence.nom}\x1b[0m`);
            }
        }

        console.log('Seed des présences terminé');
        process.exit(0);

    } catch (error) {
        console.error(`\x1b[31mErreur seed présences :${error.message}\x1b[0m`);
        process.exit(1);
    }
}

seedPresence();
