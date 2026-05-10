import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';
import AdminLayout from '../../../components/admin/AdminLayout';
import '../../../components/admin/admin.css';

const StudentListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const mockStudents = [
    { id: 'S001', name: 'Nguyễn Văn A', dob: '15/04/2015', email: 'nguyenvana@gmail.com', school: 'Tiểu học Trưng Trắc', class: '5A3', role: 'Học sinh' },
    { id: 'S002', name: 'Trần Thị B', dob: '22/08/2015', email: 'tranthib@gmail.com', school: 'Tiểu học Trưng Trắc', class: '5A4', role: 'Học sinh' },
    { id: 'S003', name: 'Lê Văn C', dob: '10/11/2015', email: 'levanc@gmail.com', school: 'Tiểu học Trưng Trắc', class: '5A5', role: 'Học sinh' }
  ];

  return (
    <AdminLayout title="Danh sách học sinh">
      <div className="admin-page-container">
        <div className="admin-page-header">
          <div className="admin-search-container">
            <FiSearch className="admin-search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm học sinh..."
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
                <th>Lớp</th>
                <th>Role</th>
                <th style={{ textAlign: 'center' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {mockStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.dob}</td>
                  <td>{student.email}</td>
                  <td>{student.school}</td>
                  <td><span className="role-badge">{student.class}</span></td>
                  <td><span className="role-badge">{student.role}</span></td>
                  <td className="action-cell">
                    <button className="btn-edit" title="Sửa" onClick={() => navigate(`/admin/users/edit/${student.id}`)}>
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
    </AdminLayout >
  );
};

export default StudentListPage;
