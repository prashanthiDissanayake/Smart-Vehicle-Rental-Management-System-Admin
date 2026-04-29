import React from "react";
import {
  LayoutDashboard,
  Car,
  CalendarRange,
  Users,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { cn } from "../lib/utils";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    // { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "vehicles", label: "Vehicles", icon: Car },
    { id: "bookings", label: "Bookings", icon: CalendarRange },
    { id: "returns", label: "Returns", icon: RotateCcw },
    { id: "users", label: "Users", icon: Users },
    { id: "payments", label: "Payments", icon: CreditCard },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-200">
          <Car size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-800">
          VehicleHub
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-brand-50 text-brand-700 font-medium shadow-sm border border-brand-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={20}
                  className={cn(
                    isActive
                      ? "text-brand-600"
                      : "text-slate-400 group-hover:text-slate-600",
                  )}
                />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <ChevronRight size={16} className="text-brand-400" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors group"
        >
          <LogOut
            size={20}
            className="text-slate-400 group-hover:text-red-500"
          />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
