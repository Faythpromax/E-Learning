import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiUsers, FiClipboard, FiBarChart2, FiSettings, FiLogOut, FiMenu } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const StudentLayout = ({ children, pageTitle = 'Dashboard', pageSubtitle = '' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { path: '/student/dashboard', label: 'Dashboard', icon: FiHome },
    { path: '/student/classes', label: 'Lop hoc', icon: FiBook },
    { path: '/student/practice', label: 'Luyen tap', icon: FiUsers },
    { path: '/student/tests', label: 'Bai kiem tra', icon: FiClipboard },
    { path: '/student/grades', label: 'Diem so', icon: FiBarChart2 },
    { path: '/student/settings', label: 'Cai dat', icon: FiSettings },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = async () => {
    if (window.confirm('Ban co chan muon dang xuat?')) {
      await logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          {sidebarOpen && (
            <span className="font-bold text-xl text-purple-600">Hoc Sinh</span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FiMenu className="text-gray-600" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  isActive(item.path)
                    ? 'bg-purple-50 text-purple-600 border-r-4 border-purple-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t p-4">
          <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                {user?.name?.charAt(0) || 'S'}
              </div>
              {sidebarOpen && (
                <div className="text-sm">
                  <p className="font-medium text-gray-800">{user?.name || 'Hoc Sinh'}</p>
                  <p className="text-gray-500 text-xs">{user?.email || 'student@example.com'}</p>
                </div>
              )}
            </div>
            {sidebarOpen && (
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Dang xuat"
              >
                <FiLogOut size={20} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>
            {pageSubtitle && <p className="text-sm text-gray-500">{pageSubtitle}</p>}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
