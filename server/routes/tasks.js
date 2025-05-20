const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');

// Standard CRUD operations
router.get('/', (tasksController.getAllTasks));
router.get('/:id', tasksController.getTaskById);
router.post('/', tasksController.createTask);
router.patch('/:id', tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask);

// Custom routes
router.get('/project/:projectId', tasksController.getTasksByProject);
router.get('/user/:userId', tasksController.getTasksByUser);
router.get('/status/:status', tasksController.getTasksByStatus);

module.exports = router;