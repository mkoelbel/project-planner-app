const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json()); // Required to parse JSON request bodies

// Routes
const tasksRoutes = require('./routes/tasks');
app.use('/api/tasks', tasksRoutes);

// Example test route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

module.exports = app;