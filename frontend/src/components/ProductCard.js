import React from 'react';
import './Product.css';

const ProductCard = ({ product, onImageClick }) => {
  // Guard clause สำหรับข้อมูล product ที่ไม่ครบ
  if (!product) {
    return <div className="product-card">ไม่พบข้อมูลสินค้า</div>;
  }

  // รองรับทั้ง product.images (array) และ product.image (string เดิม)
  const images = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);

  // คำนวณราคาต่อหน่วยตามประเภท
  const calculatePricePerUnit = () => {
    if (product.weight && product.weight > 0 && product.price) {
      // ใช้สูตรเดียวกันทั้งหมด: ราคารวม ÷ จำนวน
      return (product.price / product.weight).toFixed(2);
    }
    return null;
  };

  const pricePerUnit = calculatePricePerUnit();
  
  // กำหนดหน่วยตามประเภทราคา
  const getUnitLabel = (priceType) => {
    switch(priceType) {
      case 'per_piece': return 'ลูก';
      case 'per_pack': return 'แพ็ค';
      default: return 'กก.';
    }
  };
  
  const unitLabel = getUnitLabel(product.priceType);

  return (
    <div className="product-card">
      {images.length > 0 && (
        <img
          src={images[0]}
          alt={product.name || 'สินค้า'}
          className="product-image"
          style={{ cursor: onImageClick ? 'pointer' : 'default' }}
          onClick={onImageClick ? () => onImageClick(images, 0, product.name) : undefined}
        />
      )}
      <h3 className="product-name">{product.name || 'ไม่มีชื่อสินค้า'}</h3>
      <p className="product-category">
        {product.category && product.category.name ? product.category.name : 'ไม่มีหมวดหมู่'}
      </p>
      <p className="product-price">฿{product.price ? product.price.toFixed(2) : '0.00'}</p>
      {pricePerUnit && (
        <p className="product-price-per-kg" style={{ 
          fontSize: '0.9rem', 
          color: '#666', 
          marginTop: '5px',
          fontWeight: 'normal'
        }}>
          {pricePerUnit} บาท/{unitLabel}
        </p>
      )}
    </div>
  );
};

export default ProductCard;