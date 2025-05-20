const tasksService = require('../services/tasksService');

// Standard CRUD operations
const getAllTasks = async (req, res) => {
  try {
    const tasks = await tasksService.getAllTasks();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await tasksService.getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createTask = async (req, res) => {
  // Validate required fields
  const task = req.body;
  const requiredFields = ['name', 'description', 'project', 'user', 'deadline', 'status'];
  const missingFields = requiredFields.filter(field => !task[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
  }

  try {
    const newTask = await tasksService.createTask(task);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const updatedTask = await tasksService.updateTask(req.params.id, req.body);
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const deletedTask = await tasksService.deleteTask(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(deletedTask);
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Custom routes
const getTasksByProject = async (req, res) => {
  try {
    const tasks = await tasksService.getTasksByProject(req.params.projectId);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks by project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTasksByUser = async (req, res) => {
  try {
    const tasks = await tasksService.getTasksByUser(req.params.userId);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks by user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTasksByStatus = async (req, res) => {
  try {
    const tasks = await tasksService.getTasksByStatus(req.params.status);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks by status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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