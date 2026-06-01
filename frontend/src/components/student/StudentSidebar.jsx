import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiBookOpen,
  FiBarChart2,
  FiHelpCircle,
  FiChevronDown,
  FiBook,
} from "react-icons/fi";

const StudentSidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const isClassesActive = location.pathname.startsWith('/student/classes');
  const isTestActive = location.pathname.startsWith('/student/tests');

  return (
    <div className={`student-sidebar ${isOpen ? "open" : "closed"}`}>
      {/* Logo */}
      <div className="student-sidebar-logo">
        <div className="student-logo-icon">
          <FiBook size={20} />
        </div>
        E-Learning
      </div>

      {/* Navigation Menu */}
      <nav className="student-sidebar-nav">
        {/* Dashboard */}
        <div
          className={`nav-item ${isActive("/student/dashboard") ? "active" : ""}`}
          onClick={() => navigate("/student/dashboard")}
        >
          <FiHome className="nav-icon" />
          <span className="nav-text">Màn hình chính</span>
        </div>

        {/* Classes */}
        <div
          className={`nav-item ${isClassesActive ? "active" : ""}`}
          onClick={() => navigate('/student/classes')}
        >
          <FiBookOpen className="nav-icon" />
          <span className="nav-text">Lớp học của tôi</span>
        </div>

        {/* Exams */}
        <div
          className={`nav-item ${isTestActive ? "active" : ""}`}
          onClick={() => navigate('/student/tests')}
        >
          <FiBookOpen className="nav-icon" />
          <span className="nav-text">Bài kiểm tra</span>
        </div>

        {/* Grades */}
        <div
          className={`nav-item ${isActive("/student/grades") ? "active" : ""}`}
          onClick={() => navigate("/student/grades")}
        >
          <FiBarChart2 className="nav-icon" />
          <span className="nav-text">Kết quả học tập</span>
        </div>

        {/* Support */}
        <div
          className={`nav-item ${isActive("/student/support") ? "active" : ""}`}
          onClick={() => navigate("/student/support")}
        >
          <FiHelpCircle className="nav-icon" />
          <span className="nav-text">Trợ giúp</span>
        </div>
      </nav>
    </div>
  );
};

export default StudentSidebar;
