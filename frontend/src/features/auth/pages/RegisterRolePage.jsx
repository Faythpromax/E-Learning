import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiUsers } from 'react-icons/fi';

const RegisterRolePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dang ky tai khoan</h1>
          <p className="text-gray-500">Chon vai tro de dang ky</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/register/student')}
            className="w-full p-4 border-2 border-purple-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center gap-4 group"
          >
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <FiUser className="text-purple-600 text-2xl" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">Hoc sinh</h3>
              <p className="text-sm text-gray-500">Dang ky tai khoan hoc sinh</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/register/teacher')}
            className="w-full p-4 border-2 border-green-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all flex items-center gap-4 group"
          >
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <FiUsers className="text-green-600 text-2xl" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">Giao vien</h3>
              <p className="text-sm text-gray-500">Dang ky tai khoan giao vien</p>
            </div>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Da co tai khoan?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:underline font-medium"
            >
              Dang nhap
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterRolePage;
