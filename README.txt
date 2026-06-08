RBAC Project and Task Management System
This project is a practical assignment implementation of a role-based project and task management system. It focuses on the core workflow expected in an organization: admin login, team member management, task creation, task assignment, task status tracking, dashboard analytics, and task trash management.
Project Summary
The application is built using the MERN stack. The frontend is developed with React and Vite, while the backend uses Node.js and Express.js. MongoDB Atlas is used as the database. Authentication is handled using JWT with HTTP-only cookies. Docker configuration has also been added using Dockerfiles and docker-compose.yml for containerized local setup.
Implemented Features
• Admin login with JWT-based authentication.
• Team member creation, viewing, activation, deactivation, and deletion.
• Task creation with status, priority, date, and assigned team members.
• Dashboard with live task counts and recent task information.
• Task list view with delete-to-trash functionality.
• Trash management for deleted tasks.
• REST API structure for user and task modules.
• Docker configuration for frontend and backend containers.
• API documentation for testing and understanding the backend endpoints.
Technology Stack

Demo Credentials
Email: admin@test.com
Password: 123456
Normal Local Setup
Step 1: Open the project folder in VS Code or terminal.
cd D:\Kartik\taskmanager-main
Step 2: Install and run the backend.
cd server
npm install
npm start
Step 3: Install and run the frontend in another terminal.
cd client
npm install
npm run dev
Step 4: Open the application in the browser.
http://localhost:3000
Environment Variables
Create a server .env file using the sample below:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=8800
NODE_ENV=development
Create a client .env file using the sample below:
VITE_APP_BASE_URL=http://localhost:8800
VITE_APP_FIREBASE_API_KEY=test
Docker Setup
Docker support has been added for the project. Both frontend and backend can be started together using Docker Compose after Docker Desktop is installed and running.
cd D:\Kartik\taskmanager-main
docker compose up --build
Frontend runs on http://localhost:3000 and backend runs on http://localhost:8800.
Assumptions
• The current version focuses on the core admin workflow because of the limited practical assignment timeline.
• MongoDB is used for rapid development, although the assignment mentions a normalized MySQL schema.
• Project management, work logs, audit logs, email reminders, and role-specific dashboards are planned enhancements.
• Task deletion is handled through a trash flow, while user deletion is treated as an admin-level permanent action.
Future Enhancements
• Project management module with assigned Project Managers.
• Separate dashboards for Admin, Project Manager, and Employee roles.
• Work log submission with manager replies.
• Email deadline reminders and overdue alerts using a scheduler.
• Audit logging for login, task changes, assignments, and status updates.
• MySQL migration with normalized tables.
• Swagger documentation and automated tests.
Layer | Technology Used
Frontend | React, Vite, Tailwind CSS, Redux Toolkit
Backend | Node.js, Express.js
Database | MongoDB Atlas
Authentication | JWT with HTTP-only cookies
API Style | REST API
Containerization | Dockerfile and docker-compose.yml