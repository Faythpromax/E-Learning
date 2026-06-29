import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import AdminLayout from '../../../components/admin/AdminLayout';
import { userApi } from '../../../api/userApi';
import '../../../components/admin/admin.css';

const TeacherListPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getTeachers();
      setTeachers(response.data || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách giáo viên:', error);
      alert('Không thể tải danh sách giáo viên.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản giáo viên "${name}" không?`)) {
      try {
        const response = await userApi.deleteUser(id);
        if (response.success) {
          alert('Xóa thành công!');
          // Re-fetch or update state
          setTeachers(teachers.filter(t => t.id !== id));
        } else {
          alert(response.message || 'Xóa không thành công.');
        }
      } catch (error) {
        console.error('Lỗi khi xóa người dùng:', error);
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa người dùng.');
      }
    }
  };

  // Filter logic
  const filteredTeachers = teachers.filter(teacher => {
    const term = searchTerm.toLowerCase();
    return (
      teacher.name?.toLowerCase().includes(term) ||
      teacher.email?.toLowerCase().includes(term) ||
      teacher.phone?.toLowerCase().includes(term)
    );
  });

  // Pagination logic
  const totalItems = filteredTeachers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <AdminLayout title="Danh sách giáo viên">
      <div className="admin-page-container">
        <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="admin-search-container">
            <FiSearch className="admin-search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, sđt..."
              className="admin-search-input"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Đang tải danh sách giáo viên...</div>
        ) : (
          <>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Họ và tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Vai trò</th>
                    <th style={{ textAlign: 'center' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTeachers.length > 0 ? (
                    currentTeachers.map((teacher) => (
                      <tr key={teacher.id}>
                        <td>{teacher.id}</td>
                        <td>{teacher.name}</td>
                        <td>{teacher.email}</td>
                        <td>{teacher.phone || '-'}</td>
                        <td>
                          <span className="role-badge" style={{ backgroundColor: teacher.role === 'admin' ? '#fee2e2' : '#e0e7ff', color: teacher.role === 'admin' ? '#991b1b' : '#4f46e5' }}>
                            {teacher.role === 'admin' ? 'Quản trị viên' : 'Giáo viên'}
                          </span>
                        </td>
                        <td className="action-cell">
                          <button className="btn-edit" title="Sửa" onClick={() => navigate(`/admin/users/edit/${teacher.id}`)}>
                            <FiEdit2 size={14} /> Sửa
                          </button>
                          {teacher.role !== 'admin' && (
                            <button className="btn-delete" title="Xóa" onClick={() => handleDelete(teacher.id, teacher.name)}>
                              <FiTrash2 size={14} /> Xóa
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#9CA3AF' }}>
                        Không tìm thấy giáo viên nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="admin-pagination">
                <span className="pagination-info">
                  Hiển thị {indexOfFirstItem + 1} đến {Math.min(indexOfLastItem, totalItems)} của {totalItems} mục
                </span>
                <div className="pagination-controls">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className={`page-btn ${currentPage === 1 ? 'disabled' : ''}`}
                  >
                    Trước
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`page-btn ${currentPage === page ? 'active' : ''}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className={`page-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                  >
                    Tiếp
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default TeacherListPage;
