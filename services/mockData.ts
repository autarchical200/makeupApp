import { Service, Artist } from '../types';

export const INITIAL_SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Makeup Cô Dâu (Gói Tiêu Chuẩn)',
    description: 'Trang điểm cô dâu nhẹ nhàng, tự nhiên, bao gồm làm tóc đơn giản.',
    price: 1500000,
    durationMin: 120,
    imageUrl: 'https://picsum.photos/400/300?random=1',
  },
  {
    id: 's2',
    name: 'Makeup Dự Tiệc (Party Glam)',
    description: 'Phong cách nổi bật cho các buổi tiệc tối, sự kiện quan trọng.',
    price: 500000,
    durationMin: 60,
    imageUrl: 'https://picsum.photos/400/300?random=2',
  },
  {
    id: 's3',
    name: 'Makeup Kỷ Yếu / Chụp Ảnh',
    description: 'Trang điểm bền màu, bắt hình tốt cho các buổi chụp studio hoặc ngoại cảnh.',
    price: 350000,
    durationMin: 45,
    imageUrl: 'https://picsum.photos/400/300?random=3',
  },
  {
    id: 's4',
    name: 'Makeup Cá Nhân (Daily)',
    description: 'Trang điểm nhẹ nhàng dạo phố, đi làm, hẹn hò.',
    price: 250000,
    durationMin: 30,
    imageUrl: 'https://picsum.photos/400/300?random=4',
  }
];

export const INITIAL_ARTISTS: Artist[] = [
  {
    id: 'a1',
    name: 'Minh Anh',
    level: 'Master',
    rating: 5.0,
    imageUrl: 'https://images.unsplash.com/photo-1583336663277-620dc1996580?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  }
];
