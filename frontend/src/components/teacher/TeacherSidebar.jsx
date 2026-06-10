import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiBookOpen,
  FiFileText,
  FiHelpCircle,
  FiChevronDown,
  FiBook,
} from "react-icons/fi";

const TeacherSidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [classesOpen, setClassesOpen] = useState(true);

  const mockClasses = [
    { id: 1, name: "Tiếng Anh 5A3" },
    { id: 2, name: "Tiếng Anh 4A2" },
  ];

  const isActive = (path) => location.pathname === path;
  const isClassActive = (classId) =>
    location.pathname === `/teacher/classes/${classId}`;

  return (
    <div className={`teacher-sidebar ${isOpen ? "open" : "closed"}`}>
      {/* Logo */}
      <div className="teacher-sidebar-logo">
        <div className="teacher-logo-icon">
          <FiBook size={20} />
        </div>
        E-Learning
      </div>

      {/* Navigation Menu */}
      <nav className="teacher-sidebar-nav">
        {/* Dashboard */}
        <div
          className={`nav-item ${isActive("/teacher/dashboard") ? "active" : ""}`}
          onClick={() => navigate("/teacher/dashboard")}
        >
          <FiHome className="nav-icon" />
          <span className="nav-text">Màn hình chính</span>
        </div>

        {/* Classes */}
        <div className="nav-item-group">
          <div
            className="nav-item"
            onClick={() => setClassesOpen(!classesOpen)}
          >
            <FiBookOpen className="nav-icon" />
            <span className="nav-text">Lớp học của tôi</span>
            <FiChevronDown
              className={`nav-chevron ${classesOpen ? "open" : ""}`}
            />
          </div>

          {/* Classes Dropdown */}
          {classesOpen && (
            <div className="nav-dropdown">
              {mockClasses.map((cls) => (
                <div
                  key={cls.id}
                  className={`nav-dropdown-item ${
                    isClassActive(cls.id) ? "active" : ""
                  }`}
                  onClick={() => navigate(`/teacher/classes/${cls.id}`)}
                >
                  {cls.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className={`nav-item ${isActive("/teacher/practice") ? "active" : ""}`}
          onClick={() => navigate("/teacher/practice")}
        >
          <FiFileText className="nav-icon" />
          <span className="nav-text">Bài tập ôn tập</span>
        </div>

        <div
          className={`nav-item ${isActive("/teacher/tests") ? "active" : ""}`}
          onClick={() => navigate("/teacher/tests")}
        >
          <FiFileText className="nav-icon" />
          <span className="nav-text">Bài kiểm tra</span>
        </div>

        {/* Support */}
        <div
          className={`nav-item ${isActive("/teacher/support") ? "active" : ""}`}
          onClick={() => navigate("/teacher/support")}
        >
          <FiHelpCircle className="nav-icon" />
          <span className="nav-text">Trợ giúp</span>
        </div>
      </nav>
    </div>
  );
};

export default TeacherSidebar;
