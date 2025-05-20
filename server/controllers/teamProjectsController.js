const teamProjectsService = require('../services/teamProjectsService');

// Standard CRUD operations
const getAllTeamProjects = async (req, res) => {
  try {
    const teamProjects = await teamProjectsService.getAllTeamProjects();
    res.json(teamProjects);
  } catch (error) {
    console.error('Error fetching teamProjects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTeamProjectById = async (req, res) => {
  try {
    const teamProject = await teamProjectsService.getTeamProjectById(req.params.id);
    if (!teamProject) {
      return res.status(404).json({ error: 'TeamProject not found' });
    }
    res.json(teamProject);
  } catch (error) {
    console.error('Error fetching teamProject:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createTeamProject = async (req, res) => {
  // Validate required fields
  const teamProject = req.body;
  const requiredFields = ['team_id', 'project_id'];
  const missingFields = requiredFields.filter(field => !teamProject[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
  }

  try {
    const newTeamProject = await teamProjectsService.createTeamProject(teamProject);
    res.status(201).json(newTeamProject);
  } catch (error) {
    console.error('Error creating teamProject:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteTeamProject = async (req, res) => {
  try {
    const deletedTeamProject = await teamProjectsService.deleteTeamProject(req.params.id);
    if (!deletedTeamProject) {
      return res.status(404).json({ error: 'TeamProject not found' });
    }
    res.json(deletedTeamProject);
  } catch (error) {
    console.error('Error deleting teamProject:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Custom routes
const getTeamProjectsByTeam = async (req, res) => {
  try {
    const teamProjects = await teamProjectsService.getTeamProjectsByTeam(req.params.teamId);
    res.json(teamProjects);
  } catch (error) {
    console.error('Error fetching teamProjects by team:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTeamProjectsByProject = async (req, res) => {
  try {
    const teamProjects = await teamProjectsService.getTeamProjectsByProject(req.params.projectId);
    res.json(teamProjects);
  } catch (error) {
    console.error('Error fetching teamProjects by project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllTeamProjects,
  getTeamProjectById,
  createTeamProject,
  deleteTeamProject,
  getTeamProjectsByTeam,
  getTeamProjectsByProject,
};