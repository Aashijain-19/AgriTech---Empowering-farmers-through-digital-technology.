# 🌾 AgriTech – Smart Farming Web App (MERN)

Full-stack agri-tech platform built with **React (Vite) + Node.js/Express + MongoDB (Mongoose)**, following the MVC pattern.
# AgriTech – Empowering Farmers Through Digital Technology


AgriTech is a MERN-stack web application designed to support farmers through digital technology. It aims to bring farm management, crop information, weather updates, and agricultural resource management into one accessible platform.

#Project Overview

Farmers often need to consult multiple sources to manage their farms, monitor crops, understand weather conditions, and obtain agricultural resources. AgriTech aims to simplify these activities through a centralized, user-friendly web application.

# Objectives

- Provide a digital platform for farm management.
- Allow farmers to register and securely log in.
- Enable farmers to maintain information about their farms.
- Provide crop-related information and farming resources.
- Integrate weather forecasts to support farming decisions.
- Build a responsive and accessible interface for users.

# Technology Stack

| Technology | Purpose |
|---|---|
| MongoDB Atlas | Cloud database |
| Express.js | Backend API development |
| React.js | Frontend user interface |
| Node.js | Backend runtime |
| Vite | Frontend development and build tool |
| Mongoose | MongoDB object modeling |
| Axios | Frontend API communication |
| React Router | Frontend navigation |
| Bootstrap | Responsive UI styling |
| JSON Web Tokens (JWT) | Authentication |
| bcryptjs | Password hashing |
| OpenWeatherMap API | Planned weather integration |

# Key Features

### Authentication
- User registration and login.
- Password hashing.
- Token-based authentication.
- Protected backend routes.

### Farm Management
- Create and store farm information.
- Retrieve farms associated with the authenticated user.
- Protect farm API endpoints through authentication.

### Planned Enhancements
- Crop information and crop-stage tracking.
- Weather forecasts and city-based weather search.
- Agricultural product and resource listings.
- Orders for farming resources.
- Soil analysis and pest alerts.
- Expert consultation support.
- A comprehensive farm management dashboard.

## System Architecture

AgriTech follows a client-server architecture.

1. **Frontend:** React application developed with Vite.
2. **Backend:** Node.js and Express.js REST API.
3. **Database:** MongoDB Atlas with Mongoose models.
4. **Authentication:** JWT-based authorization and bcryptjs password hashing.
5. **External service:** OpenWeatherMap integration planned for weather information.

## Project Structure

```text
AgriTech/
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── db/
│   ├── index.js
│   └── package.json
├── documentation/
│   └── README.md
├── .gitignore
└── README.md
```

The exact files and folders may evolve as development continues.

## Installation and Setup

### Prerequisites

- Node.js and npm
- A MongoDB Atlas account or MongoDB instance
- Git
- A code editor such as Visual Studio Code

### 1. Clone the Repository

```bash
git clone https://github.com/Aashijain-19/AgriTech---Empowering-farmers-through-digital-technology.git
cd AgriTech---Empowering-farmers-through-digital-technology
```

### 2. Set Up the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_private_random_secret
```

Replace the example values with your own credentials. Never commit the `.env` file to GitHub.

Start the backend using the script configured in `server/package.json`. If the project uses nodemon, the command may be:

```bash
npm run dev
```

### 3. Set Up the Frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

## API Overview

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/users` | Register a user, if configured for registration |
| POST | `/api/users/login` | Authenticate a user |
| POST | `/api/farms` | Create a farm (authentication required) |
| GET | `/api/farms/my-farms` | Retrieve the authenticated user's farms |

Verify endpoint methods and paths against the current backend routes before testing.

## Documentation

The `documentation/` directory contains the project's supporting documentation. It can include:

- Software Requirements Specification (SRS)
- Data Flow Diagrams (DFD)
- Use Case Diagrams
- UML Diagrams
- Entity Relationship (ER) Diagram
- Testing documentation
- Project planning and design documents

## Security

- Passwords should be stored as secure hashes, not plain text.
- Protected APIs require valid authentication.
- Database credentials and JWT secrets must be kept private.
- Environment files and other sensitive configuration must not be committed to the repository.

## Future Scope

AgriTech can be extended with intelligent crop recommendations, soil-health insights, pest and disease alerts, multilingual support, agricultural market information, and data-driven farm planning.

## Project Status

**Development in progress.** Authentication and initial farm-management APIs have been developed. Additional modules will be integrated and tested incrementally.

## Contributors

**Team ID:** SWUID2026403770

