import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BookingPage from './pages/Booking';
import AdminDashboard from './pages/AdminDashboard';
import AIChatBot from './components/AIChatBot';
import { INITIAL_SERVICES, INITIAL_ARTISTS } from './services/mockData';
import { Booking, BookingStatus } from './types';
import { CheckCircle } from 'lucide-react';

const SuccessPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-rose-50 px-4">
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Đặt lịch thành công!</h2>
      <p className="text-gray-600 mb-8">
        Cảm ơn bạn đã chọn GlowUp. Chúng tôi sẽ liên hệ sớm để xác nhận lịch hẹn của bạn.
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

  return (
    <Router>
      <div className="min-h-screen bg-rose-50 font-sans">
        <Navbar isAdmin={isAdmin} toggleAdmin={() => setIsAdmin(!isAdmin)} />
        
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
                  <div className="p-8 text-center text-gray-500">
                    Bạn không có quyền truy cập. Vui lòng bật chế độ Admin ở góc trên bên phải.
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
                <p>&copy; {new Date().getFullYear()} GlowUp Makeup Services. All rights reserved.</p>
                <p className="mt-2 text-rose-300">Designed for beauty, powered by AI.</p>
            </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
