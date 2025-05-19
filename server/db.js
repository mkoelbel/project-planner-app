const { Pool } = require('pg');

const pool = new Pool({
  user: 'mariakoelbel',
  host: 'localhost',
  database: 'project_planner_db',
  port: 5432,
});

module.exports = pool;