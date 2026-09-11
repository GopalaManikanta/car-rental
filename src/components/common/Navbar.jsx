import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ setMobileOpen, pageTitle }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-orange-100 px-4 sm:px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg lg:hidden transition"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{pageTitle}</h2>
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Operational
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification Icon */}
        <button className="relative p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
