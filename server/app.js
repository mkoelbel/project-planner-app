const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json()); // Required to parse JSON request bodies

// Routes
const projectsRoutes = require('./routes/projects');
const tasksRoutes = require('./routes/tasks');
const teamProjectsRoutes = require('./routes/teamProjects');
const teamsRoutes = require('./routes/teams');
const usersRoutes = require('./routes/users');

app.use('/api/projects', projectsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/teamProjects', teamProjectsRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/users', usersRoutes);

// Example test route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

module.exports = app;