const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'fruitStoreSecretKey';

const ADMIN_USERNAME = 'Admin';
const ADMIN_PASSWORD = 'admin123';

const USERS = [
  { username: 'Admin', password: 'admin123' },
  { username: 'sj', password: 'sj5585' },
  { username: 'Somjai', password: '5585'}
];

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    // สร้าง JWT token
    const token = jwt.sign({ isAdmin: true, username }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Middleware ตรวจสอบ JWT
function verifyJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

// Logout (dummy)
router.post('/logout', (req, res) => {
  res.json({ success: true });
});

// Check login status (ตรวจสอบ JWT)
router.get('/status', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.json({ isAdmin: false });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.json({ isAdmin: false });
    res.json({ isAdmin: !!decoded.isAdmin });
  });
});

module.exports = { router, verifyJWT }; 