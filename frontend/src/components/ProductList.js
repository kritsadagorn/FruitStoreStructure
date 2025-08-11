import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, onImageClick }) => {
  if (!products || products.length === 0) {
    return (
      <div className="no-products">
        <p>ไม่พบสินค้า</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard 
          key={product._id} 
          product={product} 
          onImageClick={onImageClick}
        />
      ))}
    </div>
  );
};

export default ProductList;