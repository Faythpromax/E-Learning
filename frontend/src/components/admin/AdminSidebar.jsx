import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiMessageSquare, FiChevronDown, FiBook } from 'react-icons/fi';
import './admin.css';

const AdminSidebar = () => {
  const [isUsersOpen, setIsUsersOpen] = useState(true);
  const location = useLocation();

  const toggleUsers = (e) => {
    e.preventDefault();
    setIsUsersOpen(!isUsersOpen);
  };

  const isUsersActive = location.pathname.includes('/admin/teachers') || location.pathname.includes('/admin/students');

  return (
    <div className="admin-sidebar">
      <div className="admin-logo">
        <div className="admin-logo-icon">
          <FiBook size={20} />
        </div>
        E-Learning
      </div>

      <div className="admin-menu">
        <NavLink 
          to="/admin/dashboard" 
          className={({ isActive }) => `admin-menu-item ${isActive ? 'active' : ''}`}
        >
          <div className="admin-menu-item-content">
            <FiHome size={18} />
            Dashboard
          </div>
        </NavLink>

        <div 
          className={`admin-menu-item ${isUsersActive ? 'active' : ''}`} 
          onClick={toggleUsers}
        >
          <div className="admin-menu-item-content">
            <FiUsers size={18} />
            Quản lý người dùng
          </div>
          <FiChevronDown 
            size={16} 
            style={{ 
              transform: isUsersOpen ? 'rotate(180deg)' : 'rotate(0)', 
              transition: 'transform 0.3s ease' 
            }} 
          />
        </div>

        <div 
          className="admin-submenu" 
          style={{ maxHeight: isUsersOpen ? '120px' : '0' }}
        >
          <NavLink 
            to="/admin/teachers" 
            className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
          >
            Danh sách giáo viên
          </NavLink>
          <NavLink 
            to="/admin/students" 
            className={({ isActive }) => `admin-submenu-item ${isActive ? 'active' : ''}`}
          >
            Danh sách học sinh
          </NavLink>
        </div>

        <NavLink 
          to="/admin/feedback" 
          className={({ isActive }) => `admin-menu-item ${isActive ? 'active' : ''}`}
        >
          <div className="admin-menu-item-content">
            <FiMessageSquare size={18} />
            Feedback
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
