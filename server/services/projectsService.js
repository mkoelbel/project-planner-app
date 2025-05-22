const db = require('../db');

// Standard CRUD operations
const getAllProjects = async (status) => {
    let query = 'SELECT * FROM projects';
    let params = [];

    if (status) {
        query += ' WHERE status = $1';
        params.push(status);
    }

    const result = await db.query(query, params);
    return result.rows;
};

const getProjectById = async (id) => {
    const result = await db.query('SELECT * FROM projects WHERE id = $1', [id]);
    return result.rows[0];
};

const createProject = async (project) => {
    const { name, description, deadline, status, priority } = project;
    const result = await db.query(
        `INSERT INTO projects (name, description, deadline, status, priority) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, description, deadline, status, priority]
    );
    return result.rows[0];
}

const updateProject = async (id, updates) => {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
        throw new Error('No fields provided for update.');
    }

    const setClause = fields
        .map((field, index) => `${field} = $${index + 1}`)
        .join(', ');
    const query = `UPDATE projects SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
    const result = await db.query(query, [...values, id]);
    return result.rows[0];
};

const deleteProject = async (id) => {
    const result = await db.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

// Custom routes
const getProjectsByStatus = async (status) => {
    const result = await db.query('SELECT * FROM projects WHERE status = $1', [status]);
    return result.rows;
};

const getProjectsByPriority = async (priority) => {
    const result = await db.query('SELECT * FROM projects WHERE priority = $1', [priority]);
    return result.rows;
};

module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getProjectsByStatus,
    getProjectsByPriority,
};