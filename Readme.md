# Psiborg Assignment

Welcome to the **Psiborg Assignment** project! This guide will walk you through the setup and running process of the project on your local environment.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Dependencies](#dependencies)

---

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (v14.x or later)
- **npm** (v6.x or later)
- **MongoDB** (for the database setup)

You can download Node.js [here](https://nodejs.org/) and follow the installation instructions for MongoDB [here](https://www.mongodb.com/try/download/community).

---

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Sugreev88/psiborg_assignment.git
   Navigate into the project directory: cd psiborg_Assignment
   Install all dependencies:npm install
   ```

## Configuration

1. Create a .env file in the root directory and configure your environment variables:
   PORT=3000
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   EMAIL_SERVICE=your-email-service
   EMAIL_USER=your-email-user
   EMAIL_PASS=your-email-password

2. Replace placeholder values with your actual database connection string, JWT secret, and email service details.

## Running the Project

1. Start the server in development mode:npm run dev
2. Access the API:http://localhost:3000

## Dependencies

Dependencies
Here is a list of the key dependencies used in this project:

1. express: Web framework for Node.js
2. bcrypt: Library to hash passwords
3. dotenv: Load environment variables from .env file
4. express-rate-limit: Rate limiting middleware for Express
5. joi: Data validation library
6. jsonwebtoken: Token generation and verification
7. nodemailer: Email sending library
8. swagger-ui-express: Middleware for serving Swagger documentation
9. uuid: Library for generating unique identifiers
