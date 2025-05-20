const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projectsController');

// Standard CRUD operations
router.get('/', (projectsController.getAllProjects));
router.get('/:id', projectsController.getProjectById);
router.post('/', projectsController.createProject);
router.put('/:id', projectsController.updateProject);
router.delete('/:id', projectsController.deleteProject);

// Custom routes
router.get('/status/:status', projectsController.getProjectsByStatus);
router.get('/priority/:priority', projectsController.getProjectsByPriority);

module.exports = router;