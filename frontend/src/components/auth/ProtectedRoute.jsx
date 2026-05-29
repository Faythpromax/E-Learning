import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user: authUser, isAuthenticated: authIsAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Unified check - try both systems
  const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
  const storedUser = localStorage.getItem('user') || localStorage.getItem('auth_user');
  const user = authUser || (storedUser ? JSON.parse(storedUser) : null);
  const isAuthenticated = authIsAuthenticated || (token && storedUser);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Dang tai...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard based on role
    let redirectPath = '/login';
    if (user.role === 'admin') redirectPath = '/admin/dashboard';
    else if (user.role === 'teacher') redirectPath = '/teacher/dashboard';
    else if (user.role === 'student') redirectPath = '/student/dashboard';
    
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
