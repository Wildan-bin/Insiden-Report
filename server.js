import express from 'express';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import cors from 'cors';
import session from 'express-session';

const app = express();
const PORT = 3000;

// Database setup
const db = new sqlite3.Database('./incidents.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS incidents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      tanggal DATE NOT NULL,
      kategori TEXT NOT NULL,
      narasi TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
}

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: 'incident-report-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set to true if using HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

// API Routes

// Register
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) {
                        return res.status(400).json({ error: 'Username already exists' });
                    }
                    return res.status(500).json({ error: 'Registration failed' });
                }
                res.status(201).json({ message: 'User registered successfully' });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    db.get(
        'SELECT * FROM users WHERE username = ?',
        [username],
        async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Server error' });
            }

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            try {
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    req.session.userId = user.id;
                    req.session.username = user.username;
                    res.json({ message: 'Login successful', username: user.username });
                } else {
                    res.status(401).json({ error: 'Invalid credentials' });
                }
            } catch (error) {
                res.status(500).json({ error: 'Server error' });
            }
        }
    );
});

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
});

// Get all incidents for logged-in user
app.get('/api/incidents', requireAuth, (req, res) => {
    db.all(
        'SELECT * FROM incidents WHERE user_id = ? ORDER BY tanggal DESC, created_at DESC',
        [req.session.userId],
        (err, incidents) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch incidents' });
            }
            res.json(incidents);
        }
    );
});

// Create new incident
app.post('/api/incidents', requireAuth, (req, res) => {
    const { tanggal, kategori, narasi } = req.body;

    if (!tanggal || !kategori || !narasi) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.run(
        'INSERT INTO incidents (user_id, tanggal, kategori, narasi) VALUES (?, ?, ?, ?)',
        [req.session.userId, tanggal, kategori, narasi],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to create incident' });
            }
            res.status(201).json({
                message: 'Incident reported successfully',
                id: this.lastID
            });
        }
    );
});

// Check session status
app.get('/api/check-auth', (req, res) => {
    if (req.session.userId) {
        res.json({ authenticated: true, username: req.session.username });
    } else {
        res.json({ authenticated: false });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
