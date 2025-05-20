const db = require('../db');

// Standard CRUD operations
const getAllTeamProjects = async () => {
    const result = await db.query('SELECT * FROM team_projects');
    return result.rows;
};

const getTeamProjectById = async (id) => {
    const result = await db.query('SELECT * FROM team_projects WHERE id = $1', [id]);
    return result.rows[0];
};

const createTeamProject = async (teamProject) => {
    const { team_id, project_id } = teamProject;
    const result = await db.query(
        `INSERT INTO team_projects (team_id, project_id) 
        VALUES ($1, $2) RETURNING *`,
        [team_id, project_id]
    );
    return result.rows[0];
}

// Update method not applicable for this table

const deleteTeamProject = async (id) => {
    const result = await db.query('DELETE FROM team_projects WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

// Custom routes
const getTeamProjectsByTeam = async (teamId) => {
    const result = await db.query('SELECT * FROM team_projects WHERE team_id = $1', [teamId]);
    return result.rows;
};

const getTeamProjectsByProject = async (projectId) => {
    const result = await db.query('SELECT * FROM team_projects WHERE project_id = $1', [projectId]);
    return result.rows;
};

module.exports = {
    getAllTeamProjects,
    getTeamProjectById,
    createTeamProject,
    deleteTeamProject,
    getTeamProjectsByTeam,
    getTeamProjectsByProject,
};