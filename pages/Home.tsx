import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, CheckCircle2 } from 'lucide-react';
import { Service, Artist } from '../types';

interface HomeProps {
  services: Service[];
  artists: Artist[];
}

const Home: React.FC<HomeProps> = ({ services, artists }) => {
  const mainArtist = artists[0];

  return (
    <div className="pb-20 md:pb-0">
      {/* Hero Section */}
      <div className="relative bg-rose-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-30"
            src="https://images.unsplash.com/photo-1487412947132-232984567455?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Makeup brushes"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-rose-900 via-transparent to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
            Sun Makeup <br/>
            <span className="text-rose-300 italic text-2xl md:text-4xl">by Nhật Nhật</span>
          </h1>
          <p className="text-xl text-rose-100 max-w-2xl mb-10">
            Đánh thức vẻ đẹp rạng ngời của riêng bạn.
            Chuyên nghiệp, tận tâm và thấu hiểu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/booking"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-rose-700 bg-white hover:bg-rose-50 md:py-4 md:text-lg md:px-10 shadow-lg transition-transform transform hover:scale-105"
            >
              Đặt Lịch Ngay
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900">Dịch Vụ Nổi Bật</h2>
          <p className="mt-4 text-gray-500">Các gói trang điểm được yêu thích nhất tại Sun Makeup</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
              <div className="h-48 overflow-hidden">
                <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-sm text-gray-500 mb-4 flex-1">{service.description}</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-rose-600 font-bold text-lg">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                  </span>
                  <div className="flex items-center text-gray-400 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {service.durationMin}p
                  </div>
                </div>
                <Link to={`/booking?serviceId=${service.id}`} className="mt-4 w-full block text-center bg-gray-50 hover:bg-rose-50 text-gray-900 hover:text-rose-600 font-medium py-2 rounded-lg transition-colors border border-gray-200">
                  Chọn gói này
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Artist Section (Single Artist Mode) */}
      <div className="bg-rose-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="h-full relative min-h-[300px] md:min-h-[500px]">
                      <img src={mainArtist.imageUrl} alt={mainArtist.name} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-2">
                         <span className="bg-rose-100 text-rose-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Founder & Artist</span>
                         <div className="flex items-center text-yellow-400">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-gray-600 text-sm ml-1 font-medium">5.0 (200+ đánh giá)</span>
                         </div>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
                          Chào bạn, mình là <span className="text-rose-600">{mainArtist.name}</span>
                      </h2>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                          Với kinh nghiệm dày dạn trong nghề make up, Nhật Nhật luôn tâm niệm rằng trang điểm không phải là che đi gương mặt thật, mà là tôn vinh những nét đẹp sẵn có của bạn. 
                          <br/><br/>
                          Tại Sun Makeup, mỗi khách hàng là một "mặt trời" tỏa sáng theo cách riêng. Dù bạn cần lộng lẫy cho ngày cưới hay nhẹ nhàng dạo phố, mình luôn sẵn sàng lắng nghe.
                      </p>
                      
                      <div className="space-y-3 mb-8">
                          <div className="flex items-center gap-3 text-gray-700">
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                              <span>Mỹ phẩm chính hãng High-end</span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-700">
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                              <span>Tư vấn phong cách cá nhân hóa</span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-700">
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                              <span>Hỗ trợ làm tóc đi kèm</span>
                          </div>
                      </div>

                      <Link to="/booking" className="self-start bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition shadow-lg">
                          Đặt lịch với {mainArtist.name}
                      </Link>
                  </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Home;