import React from 'react';
import './SearchFilter.css';

const SearchFilter = ({ categories, onCategoryChange }) => {
  return (
    <div className="search-filter-container">
      <select onChange={(e) => onCategoryChange(e.target.value)} className="category-select">
        <option value="">หมวดหมู่ทั้งหมด</option>
        {categories.map(category => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchFilter; 