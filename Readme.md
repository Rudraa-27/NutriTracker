# NutriTrack

NutriTrack is a full-stack nutrition tracking web app that helps users log meals, monitor daily nutrition goals, and get quick nutrition insights from natural-language food descriptions using Google Gemini.

## Overview

This project combines:

- A React + Vite frontend for the dashboard and user interface
- A Node.js + Express backend for authentication, meal logs, and goals
- MongoDB for persistent storage
- Gemini-powered food analysis to estimate calories, protein, carbs, and fats from freeform text like "2 eggs and a bowl of oatmeal"

Users can create an account, log meals by describing what they ate, track their progress against nutrition targets, and review daily totals across multiple dates.

## Features

- User registration and login with JWT authentication
- Daily nutrition tracking by date
- Goal configuration for calories, protein, carbs, and fats
- Progress cards for each nutrition metric
- AI-based food analysis from natural language input
- Meal logs with automatic nutritional estimates
- Daily streak calculation
- Dashboard navigation across dates
- Delete food log entries

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Lucide React
- Axios

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- Google GenAI (Gemini API)

## Project Structure

```text
nutriTracker/
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── Services/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   └── ...
├── client/
│   ├── src/
│   ├── public/
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   └── ...
├── .gitignore
├── Readme.md
└── ...
```

## Prerequisites

Before running the project, make sure you have installed:

- Node.js 18+
- npm
- MongoDB instance or MongoDB Atlas connection string
- Google Gemini API key

## Environment Setup

### Backend

Create a `.env` file inside the `Backend` folder with values similar to:

```env
PORT=5231
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.8-flash
CLIENT_URL=http://localhost:5173
```

### Frontend

Create a `.env` file inside the `client` folder:

```env
VITE_API_URL=http://localhost:5231/api
```

## Installation

From the project root:

```bash
cd Backend
npm install

cd ../client
npm install
```

## Running the App

### Start the backend

```bash
cd Backend
npm run dev
```

The backend will run on:

- http://localhost:5231

### Start the frontend

```bash
cd client
npm run dev
```

The frontend will run on:

- http://localhost:5173

## API Highlights

The backend exposes endpoints for:

- User registration: `POST /api/auth/register`
- User login: `POST /api/auth/login`
- Get daily logs: `GET /api/logs`
- Analyze food and create logs: `POST /api/logs`
- Update goals: `PUT /api/goals`
- Get goals: `GET /api/goals`
- Health check: `GET /api/health`

## Usage

1. Open the frontend in the browser.
2. Register a new account or log in.
3. Enter food descriptions in the dashboard input box.
4. The app analyzes the meal text and creates estimated nutrition entries.
5. Review your calorie, protein, carb, and fat totals for the selected date.
6. Adjust your goals from the settings modal.

## Notes

- The app is intended for local development and learning projects.
- Make sure MongoDB is running and reachable from the backend before starting the app.
- Gemini quota limits may affect AI food analysis if the API key has exhausted usage.

## License

This project is licensed under the MIT License.
