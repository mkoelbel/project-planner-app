const express = require('express');
const router = express.Router();
const teamsController = require('../controllers/teamsController');

// Standard CRUD operations
router.get('/', (teamsController.getAllTeams));
router.get('/:id', teamsController.getTeamById);
router.post('/', teamsController.createTeam);
router.put('/:id', teamsController.updateTeam);
router.delete('/:id', teamsController.deleteTeam);

module.exports = router;