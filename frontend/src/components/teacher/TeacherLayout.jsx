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
    <div className="teacher-layout flex min-h-screen w-full bg-slate-50 overflow-x-hidden">
      <TeacherSidebar isOpen={sidebarOpen} />
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && window.innerWidth <= 768 && (
        <div 
          className="teacher-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Thay đổi class ở đây để ép main area luôn tự co giãn theo chiều dọc */}
      <div className="teacher-main flex-1 flex flex-col min-h-screen w-full h-auto min-w-0 overflow-y-auto">
        <TeacherHeader 
          title={pageTitle} 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        />
        {/* Ép vùng nội dung phải tự kéo dài (h-auto), hiển thị dạng block dòng chảy tự nhiên */}
        <div className="teacher-content flex-1 p-4 md:p-6 block w-full h-auto clear-both overflow-visible">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TeacherLayout;