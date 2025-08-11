const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  images: { type: [String], required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true },
  weight: { type: Number, required: true }, // เพิ่มฟิลด์น้ำหนัก (กิโลกรัม)
  priceType: { type: String, enum: ['per_kg', 'per_piece', 'per_pack'], default: 'per_kg' }, // เพิ่ม per_pack
  recommended: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);