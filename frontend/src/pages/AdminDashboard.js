import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getCategories } from '../services/api';
import CategoryManager from '../components/CategoryManager';
import ProductManager from '../components/ProductManager';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      <h2>หน้าผู้ดูแลระบบ</h2>
      <button onClick={handleLogout} className="btn logout-btn">ออกจากระบบ</button>
      <div className="admin-flex">
        <div className="admin-col admin-col-left">
          <CategoryManager categories={categories} onUpdate={fetchCategories} />
        </div>
        <div className="admin-col admin-col-right">
          <ProductManager categories={categories} onUpdate={fetchCategories} loading={loading} setLoading={setLoading} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 