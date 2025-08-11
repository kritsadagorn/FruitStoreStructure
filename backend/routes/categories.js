const express = require('express');
const Category = require('../models/Category');
const router = express.Router();
const { verifyJWT } = require('./auth');

// Middleware: ตรวจสอบ admin ด้วย JWT
function requireAdmin(req, res, next) {
  verifyJWT(req, res, function() {
    if (req.user && req.user.isAdmin) return next();
    return res.status(403).json({ message: 'Admin only' });
  });
}

// Get all categories
router.get('/', async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// Add category
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Edit category
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(req.params.id, { name }, { new: true });
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete category
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 