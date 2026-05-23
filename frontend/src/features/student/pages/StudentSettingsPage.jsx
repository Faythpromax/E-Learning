import { useState } from 'react';
import StudentLayout from '../../../components/student/StudentLayout';
import { useAuth } from '../../../contexts/AuthContext';

const StudentSettingsPage = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    // Simulate save
    setTimeout(() => {
      updateUser({ ...user, ...formData });
      alert('Luu thanh cong!');
      setSaving(false);
    }, 500);
  };

  return (
    <StudentLayout pageTitle="Cai dat" pageSubtitle="Quan ly thong tin tai khoan">
      <div className="max-w-xl">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Thong tin tai khoan</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ho va ten</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? 'Dang luu...' : 'Luu thay doi'}
            </button>
          </form>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentSettingsPage;
