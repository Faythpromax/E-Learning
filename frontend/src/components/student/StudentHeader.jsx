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

const StudentHeader = ({ title, subtitle, onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const subtitleText = subtitle || 'Chào mừng trở lại! Tiếp tục hành trình học tập của bạn.';

  const handleLogout = () => {
    logout();
    setAccountDropdownOpen(false);
  };

  const handleSettings = () => {
    navigate('/student/settings');
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
    <header className="student-header">
      {/* Left: Menu & Title */}
      <div className="student-header-left">
        <h2 className="student-header-title">{title}</h2>
        <p>{subtitleText}</p>
      </div>

      {/* Center: Search */}
      <div className="student-header-search">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Tìm kiếm lớp học..."
          className="search-input"
        />
      </div>

      {/* Right: Actions */}
      <div className="student-header-right">
        <button className="student-header-btn">
          <FiBell />
        </button>
        <button className="student-header-btn">
          <FiMessageSquare />
        </button>

        {/* Account Dropdown */}
        <div className="student-account-menu">
          <button
            className="student-account-btn"
            onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
          >
            <div className="student-avatar">{getUserInitial(user?.name)}</div>
            <div className="student-account-info">
              <span className="student-account-name">{user?.name || 'User'}</span>
              <span className="student-account-role">{getRoleLabel(user?.role)}</span>
            </div>
            <FiChevronDown
              className={`account-chevron ${
                accountDropdownOpen ? 'open' : ''
              }`}
            />
          </button>

          {accountDropdownOpen && (
            <div className="student-account-dropdown">
              <button
                className="student-dropdown-item"
                onClick={handleSettings}
              >
                <FiSettings className="dropdown-icon" />
                Cài đặt
              </button>
              <button
                className="student-dropdown-item logout"
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
          className="student-overlay"
          onClick={() => setAccountDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default StudentHeader;
