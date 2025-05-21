const analyticsService = require('../services/analyticsService');

const getTaskStatusByTeam = async (req, res) => {
  try {
    const result = await analyticsService.getTaskStatusByTeam();
    res.json(result);
  } catch (error) {
    console.error('Error fetching task status by team:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getTaskStatusByTeam,
};