const db = require('../db');

const getTaskStatusByTeam = async () => {
    const result = await db.query(`
        SELECT 
            teams.name as team_name,
            tasks.status,
            COUNT(tasks.id) as task_count
        FROM tasks as tasks
        JOIN users as users ON tasks.user_id = users.id
        JOIN teams as teams ON users.team_id = teams.id
        JOIN projects as projects ON tasks.project_id = projects.id 
        WHERE projects.status = 'in_progress'
        GROUP BY 
            teams.name, 
            tasks.status
    `);
    return result.rows;
};

module.exports = {
    getTaskStatusByTeam,
};