import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUsers, FiFileText, FiClipboard, FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import TeacherLayout from '../../../components/teacher/TeacherLayout';
import classApi from '../../../api/classApi';

const ClassDetailPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('students');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState('student');

  // Students state
  const [students, setStudents] = useState([]);
  const [studentEmail, setStudentEmail] = useState('');

  // Teachers state
  const [teachers, setTeachers] = useState([]);
  const [teacherEmail, setTeacherEmail] = useState('');

  // Materials state
  const [materials, setMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({ title: '', description: '', file_url: '', type: 'pdf' });

  // Tests state
  const [tests, setTests] = useState([]);
  const [availableTests, setAvailableTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState('');

  useEffect(() => {
    fetchClassDetail();
  }, [classId]);

  const fetchClassDetail = async () => {
    try {
      setLoading(true);
      const response = await classApi.getClassDetail(classId);
      if (response.success) {
        setClassData(response.data);
        setStudents(response.data.users?.filter(u => u.class_pivot?.role === 'student') || []);
        setTeachers(response.data.users?.filter(u => u.class_pivot?.role === 'teacher') || []);
        setMaterials(response.data.materials || []);
        setTests(response.data.tests || []);
      }
    } catch (error) {
      console.error('Failed to fetch class detail:', error);
      alert('Khong the tai thong tin lop');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStudent = async (userId) => {
    if (!confirm('Ban co chac chan muon xoa hoc sinh nay?')) return;

    try {
      await classApi.removeStudent(classId, userId);
      setStudents(students.filter(s => s.id !== userId));
    } catch (error) {
      console.error('Failed to remove student:', error);
      alert('Xoa that bai');
    }
  };

  const handleRemoveTeacher = async (userId) => {
    if (!confirm('Ban co chac chan muon xoa giao vien nay?')) return;

    try {
      await classApi.removeTeacher(classId, userId);
      setTeachers(teachers.filter(t => t.id !== userId));
    } catch (error) {
      console.error('Failed to remove teacher:', error);
      alert('Xoa that bai');
    }
  };

  const handleAddStudent = async () => {
    if (!studentEmail.trim()) return;

    try {
      await classApi.addStudent(classId, parseInt(studentEmail));
      alert('Them hoc sinh thanh cong!');
      setStudentEmail('');
      setShowAddModal(false);
      fetchClassDetail();
    } catch (error) {
      console.error('Failed to add student:', error);
      alert(error.response?.data?.message || 'Them that bai');
    }
  };

  const handleAddTeacher = async () => {
    if (!teacherEmail.trim()) return;

    try {
      await classApi.addTeacher(classId, parseInt(teacherEmail));
      alert('Them giao vien thanh cong!');
      setTeacherEmail('');
      setShowAddModal(false);
      fetchClassDetail();
    } catch (error) {
      console.error('Failed to add teacher:', error);
      alert(error.response?.data?.message || 'Them that bai');
    }
  };

  const handleAddMaterial = async () => {
    if (!newMaterial.title.trim() || !newMaterial.file_url.trim()) {
      alert('Vui long nhap day du thong tin');
      return;
    }

    try {
      await classApi.addMaterial(classId, newMaterial);
      alert('Them tai lieu thanh cong!');
      setNewMaterial({ title: '', description: '', file_url: '', type: 'pdf' });
      setShowAddModal(false);
      fetchClassDetail();
    } catch (error) {
      console.error('Failed to add material:', error);
      alert('Them that bai');
    }
  };

  const handleRemoveMaterial = async (materialId) => {
    if (!confirm('Ban co chac chan muon xoa tai lieu nay?')) return;

    try {
      await classApi.removeMaterial(classId, materialId);
      setMaterials(materials.filter(m => m.id !== materialId));
    } catch (error) {
      console.error('Failed to remove material:', error);
      alert('Xoa that bai');
    }
  };

  const handleAddTest = async () => {
    if (!selectedTest) return;

    try {
      await classApi.assignTest(classId, parseInt(selectedTest));
      alert('Gan bai kiem tra thanh cong!');
      setSelectedTest('');
      setShowAddModal(false);
      fetchClassDetail();
    } catch (error) {
      console.error('Failed to assign test:', error);
      alert(error.response?.data?.message || 'Gan that bai');
    }
  };

  const handleRemoveTest = async (testId) => {
    if (!confirm('Ban co chac chan muon xoa bai kiem tra nay?')) return;

    try {
      await classApi.removeTest(classId, testId);
      setTests(tests.filter(t => t.id !== testId));
    } catch (error) {
      console.error('Failed to remove test:', error);
      alert('Xoa that bai');
    }
  };

  const openAddModal = (type) => {
    setAddModalType(type);
    setShowAddModal(true);
  };

  const renderStudentsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Danh sach hoc sinh ({students.length})</h3>
        <button
          onClick={() => openAddModal('student')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FiPlus /> Them hoc sinh
        </button>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <FiUsers className="mx-auto text-4xl text-gray-300 mb-2" />
          <p className="text-gray-500">Chua co hoc sinh nao</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Ten</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Hanh dong</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="px-4 py-3 text-sm text-gray-800">{student.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{student.email}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleRemoveStudent(student.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderTeachersTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Danh sach giao vien ({teachers.length})</h3>
        <button
          onClick={() => openAddModal('teacher')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FiPlus /> Them giao vien
        </button>
      </div>

      {teachers.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <FiUsers className="mx-auto text-4xl text-gray-300 mb-2" />
          <p className="text-gray-500">Chua co giao vien nao</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Ten</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Hanh dong</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td className="px-4 py-3 text-sm text-gray-800">{teacher.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{teacher.email}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleRemoveTeacher(teacher.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderMaterialsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tai lieu hoc tap ({materials.length})</h3>
        <button
          onClick={() => openAddModal('material')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FiPlus /> Them tai lieu
        </button>
      </div>

      {materials.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <FiFileText className="mx-auto text-4xl text-gray-300 mb-2" />
          <p className="text-gray-500">Chua co tai lieu nao</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map((material) => (
            <div key={material.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">{material.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{material.type}</p>
                  {material.description && (
                    <p className="text-sm text-gray-600 mt-2">{material.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveMaterial(material.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 />
                </button>
              </div>
              <a
                href={material.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-blue-500 hover:text-blue-700 text-sm"
              >
                Xem tai lieu
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTestsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Bai kiem tra ({tests.length})</h3>
        <button
          onClick={() => openAddModal('test')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FiPlus /> Gan bai kiem tra
        </button>
      </div>

      {tests.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <FiClipboard className="mx-auto text-4xl text-gray-300 mb-2" />
          <p className="text-gray-500">Chua co bai kiem tra nao</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tests.map((test) => (
            <div key={test.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">{test.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {test.duration ? `${test.duration} phut` : 'Khong gioi han'}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveTest(test.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAddModal = () => {
    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">
            {addModalType === 'student' && 'Them hoc sinh'}
            {addModalType === 'teacher' && 'Them giao vien'}
            {addModalType === 'material' && 'Them tai lieu'}
            {addModalType === 'test' && 'Gan bai kiem tra'}
          </h3>

          {addModalType === 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID hoc sinh
              </label>
              <input
                type="number"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="Nhap ID hoc sinh"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg">Huy</button>
                <button onClick={handleAddStudent} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Them</button>
              </div>
            </div>
          )}

          {addModalType === 'teacher' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID giao vien
              </label>
              <input
                type="number"
                value={teacherEmail}
                onChange={(e) => setTeacherEmail(e.target.value)}
                placeholder="Nhap ID giao vien"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg">Huy</button>
                <button onClick={handleAddTeacher} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Them</button>
              </div>
            </div>
          )}

          {addModalType === 'material' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tieu de</label>
                <input
                  type="text"
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loai</label>
                <select
                  value={newMaterial.type}
                  onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="pdf">PDF</option>
                  <option value="video">Video</option>
                  <option value="link">Link</option>
                  <option value="document">Document</option>
                  <option value="other">Khac</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duong dan</label>
                <input
                  type="text"
                  value={newMaterial.file_url}
                  onChange={(e) => setNewMaterial({ ...newMaterial, file_url: e.target.value })}
                  placeholder="URL tai lieu"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mo ta</label>
                <textarea
                  value={newMaterial.description}
                  onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg">Huy</button>
                <button onClick={handleAddMaterial} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Them</button>
              </div>
            </div>
          )}

          {addModalType === 'test' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chon bai kiem tra</label>
              <select
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              >
                <option value="">-- Chon bai kiem tra --</option>
                {availableTests.map((test) => (
                  <option key={test.id} value={test.id}>{test.title}</option>
                ))}
              </select>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg">Huy</button>
                <button onClick={handleAddTest} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Gan</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <TeacherLayout pageTitle="Chi tiet lop">
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-500">Dang tai...</div>
        </div>
      </TeacherLayout>
    );
  }

  if (!classData) {
    return (
      <TeacherLayout pageTitle="Chi tiet lop">
        <div className="text-center py-20">
          <p className="text-gray-500">Khong tim thay lop</p>
          <button onClick={() => navigate('/teacher/classes')} className="mt-4 text-blue-500">Quay lai</button>
        </div>
      </TeacherLayout>
    );
  }

  const tabs = [
    { id: 'students', label: 'Hoc sinh', icon: FiUsers },
    { id: 'teachers', label: 'Giao vien', icon: FiUsers },
    { id: 'materials', label: 'Tai lieu', icon: FiFileText },
    { id: 'tests', label: 'Bai kiem tra', icon: FiClipboard },
  ];

  return (
    <TeacherLayout pageTitle={classData.name}>
      <div className="class-detail-container">
        <button
          onClick={() => navigate('/teacher/classes')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <FiArrowLeft /> Quay lai danh sach lop
        </button>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{classData.name}</h2>
          <p className="text-gray-500">
            Ma lop: <span className="font-mono font-semibold">{classData.class_code}</span>
          </p>
          {classData.description && (
            <p className="text-gray-600 mt-2">{classData.description}</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="flex border-b">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {activeTab === 'students' && renderStudentsTab()}
            {activeTab === 'teachers' && renderTeachersTab()}
            {activeTab === 'materials' && renderMaterialsTab()}
            {activeTab === 'tests' && renderTestsTab()}
          </div>
        </div>

        {renderAddModal()}
      </div>
    </TeacherLayout>
  );
};

export default ClassDetailPage;
