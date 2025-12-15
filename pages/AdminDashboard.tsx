import React, { useState } from 'react';
import { Booking, BookingStatus, Service, Artist } from '../types';
import { updateBookingStatus, isFirebaseEnabled } from '../services/firebase';
import { CheckCircle, XCircle, Clock, Search, Filter, Database, AlertTriangle } from 'lucide-react';

interface AdminDashboardProps {
  bookings: Booking[];
  services: Service[];
  artists: Artist[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ bookings, services, artists }) => {
  const [filterStatus, setFilterStatus] = useState<BookingStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const getServiceName = (id: string) => services.find(s => s.id === id)?.name || 'Unknown Service';

  const handleStatusUpdate = async (id: string, status: BookingStatus) => {
    setUpdatingId(id);
    await updateBookingStatus(id, status);
    setUpdatingId(null);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'ALL' || booking.status === filterStatus;
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          booking.customerPhone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  }).sort((a, b) => b.createdAt - a.createdAt);

  const isDBConnected = isFirebaseEnabled();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      {/* DB Connection Status Banner */}
      <div className={`mb-6 rounded-lg p-3 flex items-center justify-between ${isDBConnected ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-orange-50 text-orange-800 border border-orange-200'}`}>
         <div className="flex items-center gap-2">
            {isDBConnected ? <Database className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span className="text-sm font-medium">
                {isDBConnected 
                    ? "Đang kết nối Database Online (Real-time)" 
                    : "Đang chạy chế độ DEMO (LocalStorage - Chỉ lưu trên máy này). Vui lòng cấu hình Firebase để đồng bộ."}
            </span>
         </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Đặt Lịch</h1>
          <p className="text-sm text-gray-500">Xin chào {artists[0].name}, đây là danh sách khách hàng của bạn.</p>
        </div>
        <div className="flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-lg border border-rose-100">
            <span className="text-rose-700 font-bold text-lg">{bookings.filter(b => b.status === BookingStatus.PENDING).length}</span>
            <span className="text-rose-600 text-sm font-medium">Yêu cầu mới</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
                type="text" 
                placeholder="Tìm tên hoặc SĐT..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-rose-500"
            />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <Filter className="w-4 h-4 text-gray-500" />
            <button 
                onClick={() => setFilterStatus('ALL')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filterStatus === 'ALL' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
                Tất cả
            </button>
            {Object.values(BookingStatus).map(status => (
                 <button 
                 key={status}
                 onClick={() => setFilterStatus(status)}
                 className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    filterStatus === status 
                        ? 'bg-rose-600 text-white' 
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-rose-300'
                 }`}
             >
                 {status}
             </button>
            ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dịch vụ</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.length === 0 ? (
                  <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          Chưa có đơn đặt lịch nào phù hợp.
                      </td>
                  </tr>
              ) : (
                filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{booking.customerName}</span>
                            <span className="text-sm text-gray-500">{booking.customerPhone}</span>
                            {booking.notes && <span className="text-xs text-gray-400 italic mt-1 truncate max-w-[150px]">{booking.notes}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <span className="text-sm text-gray-900 font-medium">{getServiceName(booking.serviceId)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(booking.date).toLocaleDateString('vi-VN')}</div>
                        <div className="text-sm text-gray-500">{booking.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === BookingStatus.CONFIRMED ? 'bg-green-100 text-green-800' :
                          booking.status === BookingStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === BookingStatus.CANCELLED ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {updatingId === booking.id ? (
                            <span className="text-gray-400 text-xs">Đang lưu...</span>
                        ) : (
                            <>
                                {booking.status === BookingStatus.PENDING && (
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleStatusUpdate(booking.id, BookingStatus.CONFIRMED)}
                                            className="text-green-600 hover:text-green-900 bg-green-50 p-1.5 rounded-full transition-colors"
                                            title="Xác nhận"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => handleStatusUpdate(booking.id, BookingStatus.CANCELLED)}
                                            className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-full transition-colors"
                                            title="Hủy bỏ"
                                        >
                                            <XCircle className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                                {booking.status === BookingStatus.CONFIRMED && (
                                    <button 
                                    onClick={() => handleStatusUpdate(booking.id, BookingStatus.COMPLETED)}
                                    className="text-blue-600 hover:text-blue-900 text-xs border border-blue-200 px-3 py-1 rounded-full transition-colors hover:bg-blue-50"
                                    >
                                    Hoàn thành
                                    </button>
                                )}
                            </>
                        )}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;