import AdminLayout from '../../../components/admin/AdminLayout';

const FeedbackPage = () => {
  return (
    <AdminLayout pageTitle="Phan hoi nguoi dung">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Danh sach phan hoi</h2>
        <div className="text-center py-12 text-gray-500">
          <p>Chua co phan hoi nao</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FeedbackPage;
