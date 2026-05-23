import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiMessageSquare, FiChevronDown, FiSettings, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import './admin.css';

const AdminHeader = ({ title }) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'student':
        return 'Học sinh';
      case 'teacher':
        return 'Giáo viên';
      case 'admin':
        return 'Quản trị viên';
      default:
        return role;
    }
  };

  const getUserInitial = (name) => {
    if (!name) return 'A';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="admin-header">
      <div className="admin-header-left">
        <h2>{title || 'Dashboard'}</h2>
        <p>Chào mừng trở lại, {user?.name || 'Admin'}</p>
      </div>

      <div className="admin-header-right">
        <FiBell className="admin-header-icon" />
        <FiMessageSquare className="admin-header-icon" />

        <div className="admin-user-profile" ref={dropdownRef} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'A')}&background=0084ff&color=fff`}
            alt="Admin Avatar"
            className="admin-avatar"
          />
          <div className="admin-user-info">
            <div className="admin-user-details">
              <span className="admin-user-name">{user?.name || 'Admin'}</span>
              <span className="admin-user-role">{getRoleLabel(user?.role)}</span>
            </div>
            <FiChevronDown size={14} color="#6b7280" />
          </div>

          {isDropdownOpen && (
            <div className="admin-dropdown">
              <div
                className="admin-dropdown-item"
                onClick={(e) => { e.stopPropagation(); navigate('/admin/settings'); setIsDropdownOpen(false); }}
              >
                <FiSettings size={16} />
                Cài đặt
              </div>
              <button
                className="admin-dropdown-item logout"
                onClick={(e) => { e.stopPropagation(); handleLogout(); }}
              >
                <FiLogOut size={16} />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
