// Required packages
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating JWT tokens

const app = express();
const PORT = 3000;

// Secret key for signing JWT tokens (you should store this securely)
const JWT_SECRET = 'your_jwt_secret_key';

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: 'BlessedDaughter100.', // replace with your MySQL password
    database: 'TelemedicineDB', // ensure this database exists
};

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies

// Connect to MySQL database
let connection;

(async () => {
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL Database');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1); // Exit the app if the connection fails
    }
})();

// User registration endpoint
app.post('/patients/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the user's password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the 'patients' table
        const [result] = await connection.execute(
            'INSERT INTO patients (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        res.status(200).json({ message: 'Registration successful!' });
    } catch (error) {
        console.error('Error during registration:', error.message);
        res.status(500).json({ message: 'Unexpected error occurred. Please try again later.' });
    }
});

// User login endpoint
app.post('/patients/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query the database to find the user by email
        const [rows] = await connection.execute(
            'SELECT * FROM patients WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const user = rows[0];

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Generate a JWT token for the authenticated user
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: '1h', // Token expires in 1 hour
        });

        res.status(200).json({ message: 'Login successful!', token });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Unexpected error occurred. Please try again later.' });
    }
});

// Middleware to protect routes (for future secure endpoints)
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    // Verify the JWT token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }

        req.user = user;
        next(); // Move to the next middleware or route handler
    });
};

// Protected route example (only accessible with a valid token)
app.get('/patients/profile', authenticateToken, (req, res) => {
    res.status(200).json({ message: `Welcome, user with email: ${req.user.email}` });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
