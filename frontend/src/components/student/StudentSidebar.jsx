import React, { useState } from "react";
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
  const [classesOpen, setClassesOpen] = useState(true);

  const mockClasses = [
    { id: 1, name: "Tiếng Anh 5A3" },
    { id: 2, name: "Lịch Sử 5A3" },
    { id: 3, name: "Toán 5A3" },
  ];

  const isActive = (path) => location.pathname === path;
  const isClassActive = (classId) =>
    location.pathname === `/student/classes/${classId}`;

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
                  onClick={() => navigate(`/student/classes/${cls.id}`)}
                >
                  {cls.name}
                </div>
              ))}
            </div>
          )}
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
