import React, { useState } from 'react';
import { addCategory, updateCategory, deleteCategory } from '../services/api';

const CategoryManager = ({ categories, onUpdate }) => {
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);

  // ฟังก์ชันเรียงลำดับ 0-9, A-Z, ก-ฮ
  const sortCategories = (categories) => {
    return [...categories].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      
      // ตัวเลข (0-9)
      const isNumberA = /^[0-9]/.test(nameA);
      const isNumberB = /^[0-9]/.test(nameB);
      
      // ตัวอักษรภาษาอังกฤษ (A-Z)
      const isEnglishA = /^[a-z]/.test(nameA);
      const isEnglishB = /^[a-z]/.test(nameB);
      
      // ตัวอักษรไทย (ก-ฮ)
      const isThaiA = /^[ก-ฮ]/.test(nameA);
      const isThaiB = /^[ก-ฮ]/.test(nameB);
      
      // เรียงลำดับตามความสำคัญ: ตัวเลข -> อังกฤษ -> ไทย
      if (isNumberA && !isNumberB) return -1;
      if (!isNumberA && isNumberB) return 1;
      
      if (isEnglishA && isThaiB) return -1;
      if (isThaiA && isEnglishB) return 1;
      
      // ถ้าอยู่ในกลุ่มเดียวกัน เรียงตามตัวอักษร
      return nameA.localeCompare(nameB, 'th');
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateCategory(editingId, { name });
    } else {
      await addCategory({ name });
    }
    setName('');
    setEditingId(null);
    onUpdate(); // Tell the parent to refetch categories
  };

  const handleEdit = (category) => {
    setName(category.name);
    setEditingId(category._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(id);
      onUpdate(); // Tell the parent to refetch categories
    }
  };

  // เรียงลำดับ categories ก่อนแสดงผล
  const sortedCategories = sortCategories(categories);

  return (
    <div className="manager-container">
      <h3>แก้ไขหมวดหมู่</h3>
      <form onSubmit={handleSubmit} className="manager-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ชื่อหมวดหมู่"
          required
        />
        <button type="submit" className="btn">{editingId ? 'แก้ไข' : 'เพิ่ม'}</button>
      </form>
      <ul className="manager-list">
        {sortedCategories.map(cat => (
          <li key={cat._id}>
            {cat.name}
            <div>
              <button onClick={() => handleEdit(cat)} className="btn-edit">แก้ไข</button>
              <button onClick={() => handleDelete(cat._id)} className="btn-delete">ลบ</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManager;