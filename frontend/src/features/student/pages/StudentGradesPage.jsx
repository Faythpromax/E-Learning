import StudentLayout from '../../../components/student/StudentLayout';

const StudentGradesPage = () => {
  return (
    <StudentLayout pageTitle="Diem so" pageSubtitle="Xem ket qua hoc tap cua ban">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Ket qua hoc tap</h2>
        <div className="text-center py-12 text-gray-500">
          <p>Chua co ket qua nao</p>
          <p className="text-sm mt-2">Hay lam bai kiem tra de xem diem so</p>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentGradesPage;
