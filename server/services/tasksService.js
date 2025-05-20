const db = require('../db');

// Standard CRUD operations
const getAllTasks = async () => {
    const result = await db.query('SELECT * FROM tasks');
    return result.rows;
};

const getTaskById = async (id) => {
    const result = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
    return result.rows[0];
};

const createTask = async (task) => {
    const { name, description, project, user, deadline, status } = task;
    const result = await db.query(
        `INSERT INTO tasks (name, description, project, user, deadline, status) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [name, description, project, user, deadline, status]
    );
    return result.rows[0];
}

const updateTask = async (id, updates) => {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
        throw new Error('No fields provided for update.');
    }

    const setClause = fields
        .map((field, index) => `${field} = $${index + 1}`)
        .join(', ');
    const query = `UPDATE tasks SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
    const result = await db.query(query, [...values, id]);
    return result.rows[0];
};

const deleteTask = async (id) => {
    const result = await db.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

// Custom routes
const getTasksByProject = async (projectId) => {
    const result = await db.query('SELECT * FROM tasks WHERE project_id = $1', [projectId]);
    return result.rows;
};

const getTasksByUser = async (userId) => {
    const result = await db.query('SELECT * FROM tasks WHERE user_id = $1', [userId]);
    return result.rows;
};

const getTasksByStatus = async (status) => {
    const result = await db.query('SELECT * FROM tasks WHERE status = $1', [status]);
    return result.rows;
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTasksByProject,
    getTasksByUser,
    getTasksByStatus,
};