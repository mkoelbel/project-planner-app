-- This SQL script initializes the database for a project management application.

-- Drop tables
DROP TABLE IF EXISTS team_projects CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS teams CASCADE;

-- Create enums
CREATE TYPE status AS ENUM ('not_started', 'in_progress', 'completed', 'overdue', 'paused');
CREATE TYPE project_priority AS ENUM ('low', 'medium', 'high');

-- Create tables
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(75) UNIQUE NOT NULL,
    team_id INTEGER REFERENCES teams(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    deadline TIMESTAMP,
    status status NOT NULL DEFAULT 'not_started',
    priority project_priority NOT NULL DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    project_id INTEGER REFERENCES projects(id),
    user_id INTEGER REFERENCES users(id),
    deadline TIMESTAMP,
    status status NOT NULL DEFAULT 'not_started',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE team_projects (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id),
    project_id INTEGER REFERENCES projects(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert mock data
INSERT INTO teams (name) VALUES 
('Modeling'),
('Software Development')
;

INSERT INTO users (first_name, last_name, email, team_id) VALUES
('Modeler1', 'User1', 'modeler1user1@company.com', 1),
('Modeler2', 'User2', 'modeler2user2@company.com', 1),
('Modeler3', 'User3', 'modeler3user3@company.com', 1),
('Developer4', 'User4', 'developer4user4@company.com', 2),
('Developer5', 'User5', 'developer5user5@company.com', 2),
('Developer6', 'User6', 'developer6user6@company.com', 2)
;

INSERT INTO projects (name, description, deadline, status, priority) VALUES
('Customer Volume Forecasting Dashboard', 'Predict customer traffic by day of week and week of year.', '2026-06-30', 'not_started', 'low'),
('Product Sales Trends Dashboard', 'Track which products sell best, when, and how trends evolve over time.', '2025-12-31', 'in_progress', 'high'),
('Inventory Recommendation Tool', 'Suggest how much of each ingredient and product to stock based on sales trends and expected volume.', '2025-12-31', 'in_progress', 'high'),
('Pricing Optimization Tool', 'Recommend optimized prices for each product based on market data.', '2026-03-31', 'not_started', 'medium')
;

INSERT INTO tasks (name, description, project_id, user_id, deadline, status) VALUES
-- Project: Customer Volume Forecasting Dashboard
-- Team: Modeling
('Perform data ETL', 'Collect, clean, and load data from past customer visits.', 1, 1, '2026-01-31', 'not_started'),
('Build forecasting model', 'Create a model to predict daily and weekly customer volume.', 1, 2, '2026-03-31', 'not_started'),
('Analyze model output for insights', 'Identify peak and low days of week and weeks of year.', 1, 3, '2026-05-31', 'not_started'),
-- Team: Software Development
('Develop initial dashboard', 'Create basic dashboard visuals and user inputs.', 1, 4, '2026-02-28', 'not_started'),
('Build API', 'Setup backend endpoints to retrieve model data from database', 1, 5, '2026-04-30', 'not_started'),
('Polish dashboard', 'Make dashboard look more clean, professional, and intuitive.', 1, 6, '2026-05-31', 'not_started'),
-- Project: Product Sales Trends Dashboard
-- Team: Modeling
('Perform data ETL', 'Collect, clean, and load historical sales data.', 2, 3, '2025-05-31', 'completed'),
('Analyze data for insights', 'Detect seasonality or changing customer preferences.', 2, 2, '2025-09-30', 'not_started'),
-- Team: Software Development
('Develop initial dashboard', 'Create basic dashboard visuals and user inputs.', 2, 6, '2025-06-30', 'completed'),
('Build API', 'Setup backend endpoints to retrieve sales data from database', 2, 4, '2025-07-31', 'in_progress'),
('Polish dashboard', 'Make dashboard look more clean, professional, and intuitive.', 2, 5, '2025-10-31', 'not_started'),
-- Project: Inventory Recommendation Tool
-- Team: Modeling
('Produce daily average sales data', 'Calculate daily average sales data for each menu item.', 3, 2, '2025-06-30', 'in_progress'),
('Produce seasonal demand assumptions', 'Produce reasonable multiplier assumptions for seasonal items.', 3, 3, '2025-07-31', 'in_progress'),
('Map menu items to ingredient usage', 'Outline how much of each ingredient are used for each menu item.', 3, 1, '2025-06-30', 'completed'),
-- Team: Software Development
('Build inventory input interface', 'Allow users to enter current inventory quantities for each ingredient and product.', 3, 5, '2025-06-30', 'completed'),
('Build API', 'Setup backend endpoints to retrieve data from database', 3, 6, '2025-06-30', 'in_progress'),
('Implement inventory recommendation logic', 'Use modeling teams rules to compute how much of each ingredient to order.', 3, 6, '2025-08-31', 'not_started'),
('Display ingredient order recommendations', 'Show how much of each ingredient and product should be ordered.', 3, 4, '2025-06-30', 'in_progress'),
('Polish tool interface', 'Make interface look more clean, professional, and intuitive.', 3, 4, '2025-10-31', 'not_started'),
-- Project: Pricing Optimization Tool
-- Team: Modeling
('Perform data ETL for market sales data', 'Collect, clean, and load competitor pricing data for similar products.', 4, 1, '2025-10-31', 'not_started'),
('Perform data ETL for historical sales data', 'Collect, clean, and load historical sales data.', 4, 2, '2025-10-31', 'not_started'),
('Perform data ETL for ingredient cost data', 'Collect, clean, and load cost of ingredient data.', 4, 3, '2025-10-31', 'not_started'),
('Analyze price sensitivity', 'Understand how price changes affect sales for different menu items.', 4, 3, '2025-11-30', 'not_started'),
('Build pricing model', 'Create a model to estimate how price impacts revenue and recommend optimal prices for each product to maximize profit.', 4, 1, '2025-12-31', 'not_started'),
('Output pricing recommendations', 'Generate a list of the recommended price for each product and a brief explanation of how it was chosen.', 4, 2, '2026-01-31', 'not_started'),
-- Team: Software Development
('Develop initial tool interface', 'Allow users to view, filter, and compare current, suggested, and market prices for each item.', 4, 4, '2025-10-31', 'not_started'),
('Build API', 'Setup backend endpoints to retrieve pricing data from database', 4, 5, '2026-01-31', 'not_started'),
('Polish tool interface', 'Make interface look more clean, professional, and intuitive.', 4, 6, '2025-02-28', 'not_started')
;

INSERT INTO team_projects (team_id, project_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(2, 1),
(2, 2),
(2, 3),
(2, 4)
;
