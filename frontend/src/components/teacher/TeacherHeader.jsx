import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBell,
  FiMessageSquare,
  FiSearch,
  FiSettings,
  FiLogOut,
  FiChevronDown,
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const TeacherHeader = ({ title, onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setAccountDropdownOpen(false);
  };

  const handleSettings = () => {
    navigate('/teacher/settings');
    setAccountDropdownOpen(false);
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
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="teacher-header">
      {/* Left: Menu & Title */}
      <div className="teacher-header-left">
        <h2 className="teacher-header-title">{title}</h2>
        <p>Chào mừng trở lại, tiếp tục hành trình giảng dạy của bạn!</p>
      </div>

      {/* Center: Search */}
      <div className="teacher-header-search">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Tìm kiếm lớp học..."
          className="search-input"
        />
      </div>

      {/* Right: Actions */}
      <div className="teacher-header-right">
        <button className="teacher-header-btn">
          <FiBell />
        </button>
        <button className="teacher-header-btn">
          <FiMessageSquare />
        </button>

        {/* Account Dropdown */}
        <div className="teacher-account-menu">
          <button
            className="teacher-account-btn"
            onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
          >
            <div className="teacher-avatar">{getUserInitial(user?.name)}</div>
            <div className="teacher-account-info">
              <span className="teacher-account-name">{user?.name || 'User'}</span>
              <span className="teacher-account-role">{getRoleLabel(user?.role)}</span>
            </div>
            <FiChevronDown
              className={`account-chevron ${
                accountDropdownOpen ? 'open' : ''
              }`}
            />
          </button>

          {accountDropdownOpen && (
            <div className="teacher-account-dropdown">
              <button
                className="teacher-dropdown-item"
                onClick={handleSettings}
              >
                <FiSettings className="dropdown-icon" />
                Cài đặt
              </button>
              <button
                className="teacher-dropdown-item logout"
                onClick={handleLogout}
              >
                <FiLogOut className="dropdown-icon" />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {accountDropdownOpen && (
        <div
          className="teacher-overlay"
          onClick={() => setAccountDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default TeacherHeader;
