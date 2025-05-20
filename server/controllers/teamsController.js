const teamsService = require('../services/teamsService');

// Standard CRUD operations
const getAllTeams = async (req, res) => {
  try {
    const teams = await teamsService.getAllTeams();
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTeamById = async (req, res) => {
  try {
    const team = await teamsService.getTeamById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createTeam = async (req, res) => {
  // Validate required fields
  const team = req.body;
  const requiredFields = ['name'];
  const missingFields = requiredFields.filter(field => !team[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
  }

  try {
    const newTeam = await teamsService.createTeam(team);
    res.status(201).json(newTeam);
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateTeam = async (req, res) => {
  try {
    const updatedTeam = await teamsService.updateTeam(req.params.id, req.body);
    if (!updatedTeam) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json(updatedTeam);
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const deletedTeam = await teamsService.deleteTeam(req.params.id);
    if (!deletedTeam) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json(deletedTeam);
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
};