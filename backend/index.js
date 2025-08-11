require('dotenv').config(); // Load .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:3000",
  "https://ohmfruit-production.up.railway.app:8080", 
  "https://fruitstorebyohm.vercel.app",
  "http://dev.somjaifreshfruit.com",     
  "https://dev.somjaifreshfruit.com"     
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.set('trust proxy', 1);
app.use(session({
  secret: 'fruitstore_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'none'
  }
}));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const { router: authRoutes } = require('./routes/auth');
app.use('/api/auth', authRoutes);

const categoryRoutes = require('./routes/categories');
app.use('/api/categories', categoryRoutes);

const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

// Routes (to be added)

app.get('/', (req, res) => {
  res.send('Fruit Store API');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));