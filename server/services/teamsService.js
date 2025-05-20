const db = require('../db');

// Standard CRUD operations
const getAllTeams = async () => {
    const result = await db.query('SELECT * FROM teams');
    return result.rows;
};

const getTeamById = async (id) => {
    const result = await db.query('SELECT * FROM teams WHERE id = $1', [id]);
    return result.rows[0];
};

const createTeam = async (team) => {
    const { name } = team;
    const result = await db.query(
        `INSERT INTO teams (name) 
        VALUES ($1) RETURNING *`,
        [name]
    );
    return result.rows[0];
}

const updateTeam = async (id, updates) => {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
        throw new Error('No fields provided for update.');
    }

    const setClause = fields
        .map((field, index) => `${field} = $${index + 1}`)
        .join(', ');
    const query = `UPDATE teams SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
    const result = await db.query(query, [...values, id]);
    return result.rows[0];
};

const deleteTeam = async (id) => {
    const result = await db.query('DELETE FROM teams WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = {
    getAllTeams,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam,
};