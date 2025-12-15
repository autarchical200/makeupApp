import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Service, Artist, Booking, BookingStatus } from '../types';
import { Check, Calendar as CalendarIcon, Clock, User, Sparkles } from 'lucide-react';

interface BookingPageProps {
  services: Service[];
  artists: Artist[];
  addBooking: (booking: Booking) => void;
}

const BookingPage: React.FC<BookingPageProps> = ({ services, artists, addBooking }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Auto-select the only artist
  const singleArtist = artists[0];

  const [step, setStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(searchParams.get('serviceId') || '');
  // Default to the first (and only) artist
  const [selectedArtistId] = useState<string>(singleArtist.id); 
  
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', notes: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (searchParams.get('serviceId')) {
      setSelectedServiceId(searchParams.get('serviceId')!);
    }
  }, [searchParams]);

  const handleNext = () => {
    setStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };
  
  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API delay
    setTimeout(() => {
      const newBooking: Booking = {
        id: Math.random().toString(36).substr(2, 9),
        serviceId: selectedServiceId,
        artistId: selectedArtistId,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        date,
        time,
        status: BookingStatus.PENDING,
        createdAt: Date.now(),
        notes: customerInfo.notes
      };

      addBooking(newBooking);
      setIsSubmitting(false);
      navigate('/success');
    }, 1500);
  };

  const selectedService = services.find(s => s.id === selectedServiceId);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 pb-24 md:pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 text-center">Đặt Lịch Hẹn</h1>
        <div className="mt-4 flex justify-center items-center space-x-2 text-sm">
           <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-rose-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
           <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-rose-600' : 'bg-gray-200'}`}></div>
           <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-rose-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
           <div className={`w-12 h-0.5 ${step >= 3 ? 'bg-rose-600' : 'bg-gray-200'}`}></div>
           <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-rose-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Bước 1: Chọn dịch vụ</h2>
            
            {/* Artist Info Card - Static */}
            <div className="bg-rose-50 p-4 rounded-xl flex items-center gap-4 mb-6 border border-rose-100">
                <img src={singleArtist.imageUrl} alt={singleArtist.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                <div>
                    <p className="text-xs text-rose-600 font-semibold uppercase tracking-wide">Người thực hiện</p>
                    <h3 className="font-bold text-gray-900">{singleArtist.name}</h3>
                </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Danh sách dịch vụ</label>
              <div className="grid grid-cols-1 gap-3">
                {services.map(service => (
                  <div 
                    key={service.id}
                    onClick={() => setSelectedServiceId(service.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      selectedServiceId === service.id 
                        ? 'border-rose-500 bg-white shadow-md' 
                        : 'border-gray-100 hover:border-rose-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                        <img src={service.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover" />
                        <div>
                          <h3 className="font-bold text-gray-900">{service.name}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                             <span className="font-medium text-rose-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}</span>
                             <span>•</span>
                             <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {service.durationMin} phút</span>
                          </div>
                        </div>
                    </div>
                    {selectedServiceId === service.id && (
                        <div className="w-6 h-6 bg-rose-600 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                        </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              disabled={!selectedServiceId}
              onClick={handleNext}
              className="w-full mt-4 bg-rose-600 text-white py-3 rounded-xl font-medium hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-rose-200"
            >
              Tiếp tục
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Bước 2: Chọn thời gian</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày</label>
                    <input 
                      type="date" 
                      min={new Date().toISOString().split('T')[0]}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giờ</label>
                    <input 
                      type="time" 
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                    />
                </div>
            </div>

            <div className="bg-rose-50 p-4 rounded-lg flex items-start gap-3 mt-4">
                <Clock className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-medium text-rose-900 text-sm">Lưu ý về thời gian</h4>
                    <p className="text-sm text-rose-700 mt-1">
                        Dịch vụ {selectedService?.name} dự kiến kéo dài {selectedService?.durationMin} phút. 
                        Vui lòng đến sớm 10 phút để chuẩn bị.
                    </p>
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <button
                onClick={handleBack}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition"
                >
                Quay lại
                </button>
                <button
                disabled={!date || !time}
                onClick={handleNext}
                className="flex-1 bg-rose-600 text-white py-3 rounded-xl font-medium hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-rose-200"
                >
                Tiếp tục
                </button>
            </div>
          </div>
        )}

        {step === 3 && (
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Bước 3: Thông tin liên hệ</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                        <input 
                            required
                            type="text" 
                            placeholder="Nguyễn Văn A"
                            value={customerInfo.name}
                            onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                        <input 
                            required
                            type="tel" 
                            placeholder="0912345678"
                            value={customerInfo.phone}
                            onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú (Tùy chọn)</label>
                        <textarea 
                            rows={3}
                            placeholder="Da nhạy cảm, muốn makeup tone cam..."
                            value={customerInfo.notes}
                            onChange={e => setCustomerInfo({...customerInfo, notes: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                        />
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Tóm tắt đơn đặt</h3>
                        <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm border border-gray-100">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Dịch vụ:</span>
                                <span className="font-medium">{selectedService?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Chuyên gia:</span>
                                <span className="font-medium text-rose-600">{singleArtist.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Thời gian:</span>
                                <span className="font-medium">{time} - {new Date(date).toLocaleDateString('vi-VN')}</span>
                            </div>
                             <div className="flex justify-between pt-2 border-t border-gray-200">
                                <span className="font-bold text-gray-900">Tổng cộng:</span>
                                <span className="font-bold text-rose-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedService?.price || 0)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                        type="button"
                        onClick={handleBack}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition"
                        >
                        Quay lại
                        </button>
                        <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-rose-600 text-white py-3 rounded-xl font-medium hover:bg-rose-700 disabled:opacity-70 transition flex justify-center items-center shadow-lg shadow-rose-200"
                        >
                        {isSubmitting ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : 'Xác nhận đặt lịch'}
                        </button>
                    </div>
                </form>
            </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
