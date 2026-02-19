// backend/app/repositories/planning_calendar_state_repository.js
const db = require('../driver_connex_db');

exports.findByPlanning = async (id_planning) => {
    const { rows } = await db.query(
        `SELECT *
         FROM planning_calendar_state
         WHERE id_planning = $1`,
        [id_planning]
    );

    return rows[0] || null;
};

exports.create = async (id_planning, state) => {
    const { annee, mois, jour, heure, minute } = state;

    const { rows } = await db.query(
        `INSERT INTO planning_calendar_state
        (id_planning, annee, mois, jour, heure, minute)
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING *`,
        [id_planning, annee, mois, jour, heure, minute]
    );

    return rows[0];
};

exports.update = async (id_planning, updates) => {
    const fields = [];
    const values = [];
    let index = 1;

    for (const key in updates) {
        fields.push(`${key} = $${index}`);
        values.push(updates[key]);
        index++;
    }

    if (fields.length === 0) return null;

    const { rows } = await db.query(
        `UPDATE planning_calendar_state
         SET ${fields.join(', ')}
         WHERE id_planning = $${index}
         RETURNING *`,
        [...values, id_planning]
    );

    return rows[0];
};
