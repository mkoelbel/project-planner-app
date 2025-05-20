const usersService = require('../services/usersService');

// Standard CRUD operations
const getAllUsers = async (req, res) => {
  try {
    const users = await usersService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await usersService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createUser = async (req, res) => {
  // Validate required fields
  const user = req.body;
  const requiredFields = ['first_name', 'last_name', 'email', 'team_id'];
  const missingFields = requiredFields.filter(field => !user[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
  }

  try {
    const newUser = await usersService.createUser(user);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await usersService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await usersService.deleteUser(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(deletedUser);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Custom routes
const getUsersByTeam = async (req, res) => {
  try {
    const users = await usersService.getUsersByTeam(req.params.teamId);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users by team:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUsersByTeam,
};