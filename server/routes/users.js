const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Standard CRUD operations
router.get('/', (usersController.getAllUsers));
router.get('/:id', usersController.getUserById);
router.post('/', usersController.createUser);
router.patch('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

// Custom routes
router.get('/team/:teamId', usersController.getUsersByTeam);

module.exports = router;