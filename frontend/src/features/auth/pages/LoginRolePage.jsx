import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiUsers } from 'react-icons/fi';

const LoginRolePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Chao mung den</h1>
          <p className="text-gray-500">Chon vai tro cua ban de dang nhap</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/login/student')}
            className="w-full p-4 border-2 border-purple-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center gap-4 group"
          >
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <FiUser className="text-purple-600 text-2xl" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">Hoc sinh</h3>
              <p className="text-sm text-gray-500">Dang nhap voi tai khoan hoc sinh</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/login/teacher')}
            className="w-full p-4 border-2 border-green-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all flex items-center gap-4 group"
          >
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <FiUsers className="text-green-600 text-2xl" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">Giao vien</h3>
              <p className="text-sm text-gray-500">Dang nhap voi tai khoan giao vien</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/admin/login')}
            className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-gray-500 hover:bg-gray-50 transition-all flex items-center gap-4 group"
          >
            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <FiUser className="text-gray-600 text-2xl" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">Quan tri vien</h3>
              <p className="text-sm text-gray-500">Dang nhap voi tai khoan quan tri</p>
            </div>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Chua co tai khoan?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-blue-600 hover:underline font-medium"
            >
              Dang ky ngay
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRolePage;
