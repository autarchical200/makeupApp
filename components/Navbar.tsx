import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, LayoutDashboard, User, Lock, LogOut } from 'lucide-react';

interface NavbarProps {
  isAdmin: boolean;
  toggleAdmin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAdmin, toggleAdmin }) => {
  const navigate = useNavigate();

  // Handle mobile bottom bar click for admin/login
  const handleMobileAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAdmin) {
        // If already admin, go to dashboard
        navigate('/admin');
    } else {
        // If not admin, trigger toggle (which asks for password)
        toggleAdmin();
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="bg-rose-600 p-1.5 rounded-lg rotate-3">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
                <span className="font-serif text-xl font-bold text-gray-900 tracking-tight leading-none">Sun Makeup</span>
                <span className="text-[10px] text-rose-600 font-medium tracking-wider uppercase">by Nhật Nhật</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  isActive ? 'border-rose-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }
            >
              Trang Chủ
            </NavLink>
            <NavLink
              to="/booking"
              className={({ isActive }) =>
                `flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  isActive ? 'border-rose-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }
            >
              Đặt Lịch
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    isActive ? 'border-rose-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                Quản Lý
              </NavLink>
            )}
          </div>

          {/* Admin Toggle Switch (Desktop) */}
          <div className="hidden md:flex items-center">
            <button
              onClick={toggleAdmin}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                isAdmin ? 'bg-gray-900 text-white' : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
              }`}
            >
              {isAdmin ? <LogOut className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              {isAdmin ? 'Đăng xuất Admin' : 'Đăng nhập Admin'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 z-50 pb-safe">
        <NavLink to="/" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-rose-600' : 'text-gray-500'}`}>
          <Sparkles className="w-6 h-6" />
          <span className="text-[10px]">Home</span>
        </NavLink>
        <NavLink to="/booking" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-rose-600' : 'text-gray-500'}`}>
          <Calendar className="w-6 h-6" />
          <span className="text-[10px]">Đặt lịch</span>
        </NavLink>
        
        {/* Mobile Admin/Login Button */}
        <button 
            onClick={handleMobileAdminClick} 
            className={`flex flex-col items-center gap-1 ${isAdmin ? 'text-rose-600' : 'text-gray-500'}`}
        >
           {isAdmin ? <LayoutDashboard className="w-6 h-6" /> : <User className="w-6 h-6" />}
           <span className="text-[10px]">{isAdmin ? 'Quản lý' : 'Admin'}</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;