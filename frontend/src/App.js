import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { User } from 'lucide-react';
import './App.css';

// Pages (to be created)
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <div className="container">
        <div className="header-flex">
          <div className="header-left">
            <img src={process.env.PUBLIC_URL + '/logoFruit.jpg'} alt="Somjai Logo" className="logo-fruit" />
            <h1>Somjai Fresh Fruit</h1>
          </div>
          <div className="header-right">
            <Link 
              to="/login" 
              className="login-icon-link"
            >
              <User size={24} />
            </Link>
          </div>
        </div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/admindashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
