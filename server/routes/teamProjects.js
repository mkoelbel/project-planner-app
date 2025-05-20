const express = require('express');
const router = express.Router();
const teamProjectsController = require('../controllers/teamProjectsController');

// Standard CRUD operations
router.get('/', (teamProjectsController.getAllTeamProjects));
router.get('/:id', teamProjectsController.getTeamProjectById);
router.post('/', teamProjectsController.createTeamProject);
router.delete('/:id', teamProjectsController.deleteTeamProject);

// Custom routes
router.get('/team/:teamId', teamProjectsController.getTeamProjectsByTeam);
router.get('/project/:projectId', teamProjectsController.getTeamProjectsByProject);

module.exports = router;