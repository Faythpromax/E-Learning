import StudentLayout from '../../../components/student/StudentLayout';

const StudentSupportPage = () => {
  return (
    <StudentLayout pageTitle="Ho tro" pageSubtitle="Lien he voi chung toi neu can giup do">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Tro giup</h2>
        <div className="text-center py-12 text-gray-500">
          <p>Neu ban can ho tro, vui long lien he qua:</p>
          <p className="mt-2 font-medium">email: support@example.com</p>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentSupportPage;
