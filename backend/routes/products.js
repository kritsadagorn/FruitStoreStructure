const express = require('express');
const multer = require('multer');
const mime = require('mime-types');
// const { storage } = require('../config/cloudinary'); // Import Cloudinary storage
const { storage } = require('../config/b2');
const { verifyJWT } = require('./auth');
const { s3 } = require('../config/b2');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');

// Multer file filter for image types
const allowedExtensions = [
  '.jpg','.jpeg','.png','.gif','.bmp','.tif','.tiff','.webp','.heic','.heif','.raw','.cr2','.nef','.arw','.orf','.rw2',
  '.svg','.ai','.eps','.pdf','.ico','.dds','.psd','.xcf','.apng','.avif','.jxl','.icns','.tga'
];
const allowedMimeTypes = allowedExtensions.map(ext => mime.lookup(ext)).filter(Boolean);
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only these file types are allowed: ' + allowedExtensions.join(',')), false);
  }
};

const upload = multer({ storage, fileFilter });
const Product = require('../models/Product');
const Category = require('../models/Category');
const router = express.Router();

// Middleware: ตรวจสอบ admin ด้วย JWT
function requireAdmin(req, res, next) {
  verifyJWT(req, res, function() {
    if (req.user && req.user.isAdmin) return next();
    return res.status(403).json({ message: 'Admin only' });
  });
}

// Get all products (with filter & search)
// /api/products?category=...&search=...
router.get('/', async (req, res) => {
  const { category, search } = req.query;
  let filter = {};
  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: 'i' };
  const products = await Product.find(filter).populate('category').sort({ createdAt: -1 });
  res.json(products);
});

// Get new arrivals (ล่าสุด 5 รายการ)
router.get('/new', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 }).limit(5).populate('category');
  res.json(products);
});

// Get recommended products
router.get('/recommended', async (req, res) => {
  const products = await Product.find({ recommended: true }).populate('category');
  res.json(products);
});

// Toggle product recommendation status
router.put('/:id/recommend', requireAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'ไม่พบสินค้า' });
    }
    
    product.recommended = !product.recommended;
    await product.save();
    
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add product
router.post('/', upload.array('images'), async (req, res) => {
  const { name } = req.body;
  // ตรวจสอบชื่อซ้ำ
  const existing = await Product.findOne({ name });
  if (existing) {
    return res.status(409).json({ message: 'มีสินค้านี้อยู่แล้ว' });
  }
  try {
    const { category, price, weight, priceType } = req.body; // เพิ่ม priceType
    const images = req.files ? req.files.map(f => f.location) : [];
    const product = new Product({ name, images, category, price, weight, priceType }); // เพิ่ม priceType
    await product.save();
    res.json(product);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'มีสินค้านี้อยู่แล้ว' });
    }
    res.status(400).json({ message: err.message });
  }
});

// Edit product
router.put('/:id', requireAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const { name, category, price, weight, priceType } = req.body; // เพิ่ม priceType
    let updateData = { name, category, price, weight, priceType }; // เพิ่ม priceType
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(f => f.location);
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Helper function to extract S3 key from URL
function getS3KeyFromUrl(url) {
  // Example: https://<endpoint>/<bucket>/fruitStore/12345-filename.jpg
  const match = url.match(/\/([^\/]+\/[^\/]+)$/);
  return match ? match[1] : null;
}

// Delete product
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    // Delete images from S3
    if (product.images && product.images.length > 0) {
      const bucket = process.env.B2_BUCKET;
      await Promise.all(product.images.map(async (url) => {
        const Key = getS3KeyFromUrl(url);
        if (Key) {
          try {
            await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key }));
          } catch (err) {
            console.error('Failed to delete S3 object:', Key, err.message);
          }
        }
      }));
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;