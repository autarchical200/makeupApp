import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BookingPage from './pages/Booking';
import AdminDashboard from './pages/AdminDashboard';
import AIChatBot from './components/AIChatBot';
import { INITIAL_SERVICES, INITIAL_ARTISTS } from './services/mockData';
import { Booking, BookingStatus } from './types';
import { CheckCircle, X } from 'lucide-react';

const SuccessPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-rose-50 px-4">
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Đặt lịch thành công!</h2>
      <p className="text-gray-600 mb-8">
        Cảm ơn bạn đã chọn Sun Makeup. Chúng tôi sẽ liên hệ sớm để xác nhận lịch hẹn của bạn.
      </p>
      <a href="/#/" className="bg-rose-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-rose-700 transition">
        Về trang chủ
      </a>
    </div>
  </div>
);

const App: React.FC = () => {
  // State for data persistence
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('glowup_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');

  // Persistence effect
  useEffect(() => {
    localStorage.setItem('glowup_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  // Password protected toggle logic
  const toggleAdmin = () => {
    if (isAdmin) {
        // If logging out, just switch off
        setIsAdmin(false);
    } else {
        // If logging in, open modal
        setShowPasswordModal(true);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "123456") {
        setIsAdmin(true);
        setShowPasswordModal(false);
        setPassword('');
    } else {
        alert("Mật khẩu không đúng! Vui lòng thử lại.");
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-rose-50 font-sans">
        <Navbar isAdmin={isAdmin} toggleAdmin={toggleAdmin} />
        
        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100">
               <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-xl font-bold text-gray-900">Đăng nhập Admin</h3>
                    <p className="text-sm text-gray-500">Khu vực dành cho Nhật Nhật</p>
                 </div>
                 <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-1.5 rounded-full transition">
                   <X className="w-5 h-5" />
                 </button>
               </div>
               <form onSubmit={handleLogin}>
                 <div className="mb-5">
                   <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu bảo mật</label>
                   <input 
                     type="password" 
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all bg-gray-50 focus:bg-white"
                     placeholder="Nhập mật khẩu..."
                     autoFocus
                   />
                 </div>
                 <button 
                   type="submit"
                   className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 active:bg-gray-950 transition shadow-lg"
                 >
                   Xác nhận
                 </button>
               </form>
            </div>
          </div>
        )}

        <main>
          <Routes>
            <Route path="/" element={<Home services={INITIAL_SERVICES} artists={INITIAL_ARTISTS} />} />
            <Route 
              path="/booking" 
              element={
                <BookingPage 
                  services={INITIAL_SERVICES} 
                  artists={INITIAL_ARTISTS} 
                  addBooking={addBooking} 
                />
              } 
            />
            <Route path="/success" element={<SuccessPage />} />
            <Route 
              path="/admin" 
              element={
                isAdmin ? (
                  <AdminDashboard 
                    bookings={bookings}
                    services={INITIAL_SERVICES}
                    artists={INITIAL_ARTISTS}
                    updateBookingStatus={updateBookingStatus}
                  />
                ) : (
                  <div className="p-8 text-center flex flex-col items-center justify-center min-h-[50vh]">
                    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Khu vực quản trị</h3>
                        <p className="text-gray-500 mb-6">Vui lòng đăng nhập để truy cập trang này.</p>
                        <button 
                            onClick={toggleAdmin}
                            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                        >
                            Đăng nhập
                        </button>
                    </div>
                  </div>
                )
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <AIChatBot />

        <footer className="bg-white border-t border-rose-100 py-8 mt-12 pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Sun Makeup (Nhật Nhật). All rights reserved.</p>
                <p className="mt-2 text-rose-300">Designed for beauty, powered by AI.</p>
            </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;