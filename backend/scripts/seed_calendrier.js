// backend/scripts/seed_calendrier.js
//require('dotenv').config();
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

                console.log(`✅ Calendrier créé : ${calendrier.type_calendrier}`);
            } else {
                console.log(`ℹ️ Calendrier déjà existant : ${calendrier.type_calendrier}`);
            }
        }

        console.log('Seed des calendriers terminé');
        process.exit(0);

    } catch (error) {
        console.error('❌ Erreur seed calendriers :', error.message);
        process.exit(1);
    }
}

seedCalendriers();
