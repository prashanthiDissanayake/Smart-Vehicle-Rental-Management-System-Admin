import React from "react";
import { Search, Bell, User, ChevronDown } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center bg-slate-100 px-3 py-2 rounded-lg w-96">
        <Search size={18} className="text-slate-400 mr-2" />
        <input
          type="text"
          placeholder="Search for vehicles, bookings..."
          className="bg-transparent border-none outline-none text-sm w-full text-slate-600 placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-slate-200"></div>
      </div>
    </header>
  );
};

export default Header;
