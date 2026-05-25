import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';
import AdminLayout from '../../../components/admin/AdminLayout';
import '../../../components/admin/admin.css';

const TeacherListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const mockTeachers = [
    { id: 'T001', name: 'Nguyễn Văn A', dob: '15/04/1985', email: 'nguyenvana@gmail.com', school: 'THPT Chuyên Hà Nội', role: 'Giáo viên' },
    { id: 'T002', name: 'Trần Thị B', dob: '22/08/1990', email: 'tranthib@gmail.com', school: 'THPT Chu Văn An', role: 'Giáo viên' },
    { id: 'T003', name: 'Lê Văn C', dob: '10/11/1988', email: 'levanc@gmail.com', school: 'THPT Ams', role: 'Giáo viên' }
  ];

  return (
    <AdminLayout title="Danh sách giáo viên">
      <div className="admin-page-container">
        <div className="admin-page-header">
          <div className="admin-search-container">
            <FiSearch className="admin-search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm giáo viên..."
              className="admin-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ và tên</th>
                <th>Ngày sinh</th>
                <th>Email</th>
                <th>Trường</th>
                <th>Role</th>
                <th style={{ textAlign: 'center' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {mockTeachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>{teacher.id}</td>
                  <td>{teacher.name}</td>
                  <td>{teacher.dob}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.school}</td>
                  <td><span className="role-badge">{teacher.role}</span></td>
                  <td className="action-cell">
                    <button className="btn-edit" title="Sửa" onClick={() => navigate(`/admin/users/edit/${teacher.id}`)}>
                      <FiEdit2 size={16} /> Sửa
                    </button>
                    <button className="btn-delete" title="Xóa">
                      <FiTrash2 size={16} /> Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-pagination">
          <span className="pagination-info">Hiển thị 1 đến 3 của 3 mục</span>
          <div className="pagination-controls">
            <button className="page-btn disabled">Trước</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">Tiếp</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TeacherListPage;
