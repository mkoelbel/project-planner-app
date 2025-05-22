const projectsService = require('../services/projectsService');

// Standard CRUD operations
const getAllProjects = async (req, res) => {
  try {
    const { status } = req.query;
    const projects = await projectsService.getAllProjects(status);
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await projectsService.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createProject = async (req, res) => {
  // Validate required fields
  const project = req.body;
  const requiredFields = ['name', 'description', 'deadline', 'status', 'priority'];
  const missingFields = requiredFields.filter(field => !project[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
  }

  try {
    const newProject = await projectsService.createProject(project);
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateProject = async (req, res) => {
  try {
    const updatedProject = await projectsService.updateProject(req.params.id, req.body);
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const deletedProject = await projectsService.deleteProject(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(deletedProject);
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Custom routes
const getProjectsByStatus = async (req, res) => {
  try {
    const projects = await projectsService.getProjectsByStatus(req.params.status);
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects by status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getProjectsByPriority = async (req, res) => {
  try {
    const projects = await projectsService.getProjectsByPriority(req.params.priority);
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects by priority:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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