# Insiden-Report

A fullstack incident reporting website built with React + Vite for the frontend and Express.js for the backend.  This application allows users to register, login, and manage incident reports through an intuitive dashboard.

## 🚀 Features

- **User Authentication**:  Secure registration and login system with bcrypt password hashing
- **Session Management**: Session-based authentication for secure user sessions
- **Incident Reporting**: Submit and track incident reports with date, category, and narrative
- **Dashboard**: View all your submitted incident reports in one place
- **Modern UI**:  Built with Tailwind CSS for a clean, responsive design

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Express.js** - Node.js web framework
- **SQLite** - Lightweight database
- **bcrypt** - Password hashing
- **express-session** - Session management
- **CORS** - Cross-origin resource sharing

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Wildan-bin/Insiden-Report.git
   cd Insiden-Report
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🏃 Running the Application

You need to run both the backend server and frontend dev server:

### Terminal 1 - Backend Server
```bash
npm run server
# or
node server.js
```
Backend runs on:  `http://localhost:3000`

### Terminal 2 - Frontend Dev Server
```bash
npm run dev
```
Frontend runs on:  `http://localhost:5173`

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Login user |
| POST | `/api/logout` | Logout user |
| GET | `/api/incidents` | Get all incidents for the logged-in user |
| POST | `/api/incidents` | Submit a new incident report |

## 🏗️ Project Structure

```
Insiden-Report/
├── src/
│   ├── pages/
│   │   ├── Register.jsx    # Registration page
│   │   ├── Login.jsx       # Login page
│   │   └── Dashboard.jsx   # Dashboard with incident list and form
│   ├── App.jsx             # Main app component with routing
│   ├── main.jsx            # React entry point
│   └── index.css           # Tailwind CSS imports and custom styles
├── server.js               # Express. js backend server
├── incidents.db            # SQLite database
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── postcss.config.js       # PostCSS configuration
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run server` | Start Express.js backend server |

## 🔐 Security

- Passwords are hashed using **bcrypt** before storing in the database
- Session-based authentication for secure user sessions
- CORS configured for frontend-backend communication

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

- [@Wildan-bin](https://github.com/Wildan-bin)
