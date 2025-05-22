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

const getProjectsTasks = async () => {
    const result = await db.query(`
        SELECT
            projects.id as project_id,
            projects.name as project_name,
            projects.description as project_description,
            projects.deadline as project_deadline,
            projects.status as project_status,
            projects.priority as project_priority,
            tasks.id as task_id,
            tasks.name as task_name,
            tasks.description as task_description,
            tasks.user_id as task_user_id,
            users.first_name as task_user_first_name,
            users.last_name as task_user_last_name,
            users.email as task_user_email,
            users.team_id as task_user_team_id,
            teams.name as task_user_team_name,
            tasks.deadline as task_deadline,
            tasks.status as task_status
        FROM projects as projects
        JOIN tasks as tasks ON projects.id = tasks.project_id
        JOIN users as users ON tasks.user_id = users.id
        JOIN teams as teams ON users.team_id = teams.id
        ORDER BY 
            projects.name,
            tasks.id
    `);
    const rows = result.rows;

    // Return nested list rather than flat table, since frontend grouped table works best with nested data
    const projectsMap = {};
    rows.forEach(row => {
        const { 
            project_id, project_name, project_description, project_deadline, project_status, project_priority, 
            task_id, task_name, task_description, task_user_id, task_deadline, task_status,
            task_user_first_name, task_user_last_name, task_user_email, task_user_team_id, task_user_team_name 
        } = row;

        if (!projectsMap[project_id]) {
            projectsMap[project_id] = {
                id: project_id,
                name: project_name,
                description: project_description,
                deadline: project_deadline,
                status: project_status,
                priority: project_priority,
                tasks: [],
            };
        }

        projectsMap[project_id].tasks.push({
            id: task_id,
            name: task_name,
            description: task_description,
            user_id: task_user_id,
            user_first_name: task_user_first_name,
            user_last_name: task_user_last_name,
            user_email: task_user_email,
            user_team_id: task_user_team_id,
            user_team_name: task_user_team_name,
            deadline: task_deadline,
            status: task_status,
        });
    });
    return Object.values(projectsMap);
};

module.exports = {
    getTaskStatusByTeam,
    getProjectsTasks,
};