import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import '../../../components/admin/admin.css';

const EditUserPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Thường sẽ call API lấy chi tiết user theo ID, mock cứng dữ liệu
  const isStudent = id?.startsWith('S');

  return (
    <AdminLayout title={`Sửa thông tin ${isStudent ? 'học sinh' : 'giáo viên'}`}>
      <div className="admin-form-card">
        <div className="admin-form-header">
          Sửa thông tin {isStudent ? 'học sinh' : 'giáo viên'}
        </div>
        <div className="admin-form-body">
          <div className="admin-form-group">
            <label className="admin-form-label">Họ và tên:</label>
            <input type="text" className="admin-form-input" defaultValue="Nguyễn Văn A" />
          </div>
          
          <div className="admin-form-group">
            <label className="admin-form-label">Email:</label>
            <input type="email" className="admin-form-input" defaultValue="nguyenvana@gmail.com" />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Trường:</label>
            <div style={{ display: 'flex', flex: 1, maxWidth: '400px', gap: '16px', alignItems: 'center' }}>
              <input type="text" className="admin-form-input" style={{ maxWidth: 'none', flex: 2 }} defaultValue={isStudent ? "Tiểu học Trưng Trắc" : "THPT Chuyên Hà Nội"} />
              {isStudent && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <label className="admin-form-label" style={{ width: 'auto', marginBottom: 0 }}>Lớp:</label>
                  <input type="text" className="admin-form-input" style={{ maxWidth: 'none', flex: 1 }} defaultValue="5A3" />
                </div>
              )}
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Ngày sinh:</label>
            <input type="text" className="admin-form-input" defaultValue="15/04/1985" />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Địa chỉ:</label>
            <input type="text" className="admin-form-input" defaultValue="Hà Nội" />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Số điện thoại:</label>
            <input type="text" className="admin-form-input" defaultValue="0987654321" />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Quyền:</label>
            <select className="admin-form-select" defaultValue={isStudent ? "Học sinh" : "Giáo viên"}>
              <option value="Giáo viên">Giáo viên</option>
              <option value="Học sinh">Học sinh</option>
            </select>
          </div>

          <div className="admin-form-actions">
            <button className="admin-btn-cancel" onClick={() => navigate(-1)}>
              Hủy
            </button>
            <button className="admin-btn-submit">
              Sửa
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditUserPage;
