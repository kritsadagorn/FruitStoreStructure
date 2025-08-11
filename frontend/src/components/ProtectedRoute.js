import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + '/auth/status' || 'http://localhost:5000/api/auth/status',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.isAdmin) {
          setIsAdmin(true);
        } else {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setChecking(false);
      }
    };
    checkAuth();
    // eslint-disable-next-line
  }, []);

  if (checking) return null;
  return isAdmin ? children : null;
};

export default ProtectedRoute; 