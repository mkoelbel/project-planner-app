const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/task-status-by-team', analyticsController.getTaskStatusByTeam);

module.exports = router;