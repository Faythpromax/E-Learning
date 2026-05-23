import { useNavigate } from 'react-router-dom';
import { FiBook, FiUsers, FiCheckCircle, FiTrendingUp, FiPlay, FiAward } from 'react-icons/fi';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FiBook,
      title: 'Kho cau hoi',
      description: 'Hien co hon 1000+ cau hoi thuoc nhieu chu de khac nhau',
    },
    {
      icon: FiUsers,
      title: 'Quan ly lop hoc',
      description: 'To chuc lop hoc, them hoc sinh va theo doi tien do',
    },
    {
      icon: FiCheckCircle,
      title: 'Bai kiem tra',
      description: 'Tao va cham diem bai kiem tra tu dong',
    },
    {
      icon: FiTrendingUp,
      title: 'Theo doi tien do',
      description: 'Xem ket qua hoc tap va diem so chi tiet',
    },
  ];

  const stats = [
    { value: '1000+', label: 'Cau hoi' },
    { value: '500+', label: 'Hoc sinh' },
    { value: '50+', label: 'Giao vien' },
    { value: '100+', label: 'Bai kiem tra' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FiBook className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold text-gray-800">E-Learning</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Dang nhap
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Dang ky
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-500 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Hoc tap hieu qua hon<br />cung E-Learning
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Noi bat dau hanh trinh hoc tap cua ban voi kho cau hoi phong phu,
            bai kiem tra thong minh va he thong theo doi tien do chi tiet
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-semibold flex items-center gap-2"
            >
              <FiPlay /> Bat dau ngay
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 font-semibold"
            >
              Tìm hieu them
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Tinh nang noi bat</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chung toi cung cap nhieu tinh nang huu ich de ho tro qua trinh hoc tap
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="text-blue-600 text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <FiAward className="mx-auto text-5xl mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">San sang bat dau hoc tap?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Dang ky tai khoan mien phi va bat dau hanh trinh hoc tap cua ban ngay hom nay
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-semibold text-lg"
          >
            Dang ky miễn phí
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 E-Learning. Tat ca quyen duoc bao luc.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
