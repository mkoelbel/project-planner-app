const db = require('../db');

// Standard CRUD operations
const getAllUsers = async () => {
    const result = await db.query('SELECT * FROM users');
    return result.rows;
};

const getUserById = async (id) => {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
};

const createUser = async (user) => {
    const { first_name, last_name, email, team_id } = user;
    const result = await db.query(
        `INSERT INTO users (first_name, last_name, email, team_id) 
        VALUES ($1, $2, $3, $4) RETURNING *`,
        [first_name, last_name, email, team_id]
    );
    return result.rows[0];
}

const updateUser = async (id, updates) => {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
        throw new Error('No fields provided for update.');
    }

    const setClause = fields
        .map((field, index) => `${field} = $${index + 1}`)
        .join(', ');
    const query = `UPDATE users SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
    const result = await db.query(query, [...values, id]);
    return result.rows[0];
};

const deleteUser = async (id) => {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

// Custom routes
const getUsersByTeam = async (teamId) => {
    const result = await db.query('SELECT * FROM users WHERE team_id = $1', [teamId]);
    return result.rows;
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUsersByTeam,
};