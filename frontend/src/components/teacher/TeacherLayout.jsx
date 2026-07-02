import React, { useState, useEffect } from 'react';
import TeacherSidebar from './TeacherSidebar';
import TeacherHeader from './TeacherHeader';
import './teacher.css';

const TeacherLayout = ({ children, pageTitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="teacher-layout">
      <TeacherSidebar isOpen={sidebarOpen} />
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && window.innerWidth <= 768 && (
        <div 
          className="teacher-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="teacher-main">
        <TeacherHeader 
          title={pageTitle} 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        />
        <div className="teacher-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TeacherLayout;
