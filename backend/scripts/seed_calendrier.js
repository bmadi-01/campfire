// backend/scripts/seed_calendrier.js
//require('dotenv').config();
// Lancer le sript = node /chemin/seed_calendrier.js

const db = require('../app/driver_connex_db');

const CALENDRIERS = [
    {
        type_calendrier: 'GREGORIEN'
    },
    {
        type_calendrier: 'DIEGETIQUE'
    }
];

async function seedCalendriers() {
    try {
        console.log('Seed des calendriers en cours...');

        for (const calendrier of CALENDRIERS) {
            const { rows } = await db.query(
                'SELECT id_calendrier FROM calendrier WHERE type_calendrier = $1',
                [calendrier.type_calendrier]
            );

            if (rows.length === 0) {
                await db.query(
                    'INSERT INTO calendrier (type_calendrier) VALUES ($1)',
                    [calendrier.type_calendrier]
                );

                // code couleur \x1b[00m texte \x1b[0m
                console.log(`\x1b[32mCalendrier créé : ${calendrier.type_calendrier}\x1b[0m`);
            } else {
                console.log(`\x1b[34mCalendrier déjà existant : ${calendrier.type_calendrier}\x1b[0m`);
            }
        }

        console.log('Seed des calendriers terminé');
        process.exit(0);

    } catch (error) {
        console.error(`\x1b[31mErreur seed calendriers : ${error.message}\x1b[0m`);
        process.exit(1);
    }
}

seedCalendriers();
