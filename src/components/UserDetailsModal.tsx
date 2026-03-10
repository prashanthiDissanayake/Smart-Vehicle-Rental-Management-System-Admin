import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, Calendar, Shield, Briefcase, User as UserIcon, MapPin, Clock, History, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { User } from '../types';
import { cn } from '../lib/utils';

interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, isOpen, onClose }) => {
  if (!user || !isOpen) return null;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase border border-red-100">
            <Shield size={12} />
            Admin
          </span>
        );
      case 'Staff':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase border border-blue-100">
            <Briefcase size={12} />
            Staff
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase border border-emerald-100">
            <UserIcon size={12} />
            Customer
          </span>
        );
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden"
        >
          <div className="relative h-48 bg-slate-900 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/80 to-brand-900/90 mix-blend-multiply" />
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
              className="absolute inset-0 w-full h-full object-cover opacity-50"
              alt="Cover"
            />
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-xl border border-white/20 transition-all z-10"
            >
              <X size={20} />
            </button>
            
            <div className="absolute bottom-6 left-8 flex items-end gap-6">
              <div className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl backdrop-blur-md bg-white/10 flex-shrink-0">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="mb-2">
                <h3 className="text-3xl font-bold text-white leading-tight tracking-tight drop-shadow-sm">{user.name}</h3>
                <div className="flex items-center gap-3 mt-2">
                  {getRoleBadge(user.role)}
                  <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-md backdrop-blur-sm">ID: {user.id}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-8">
            {/* Quick Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center group hover:bg-brand-50 hover:border-brand-100 transition-all cursor-default">
                <History className="mb-2 text-slate-400 group-hover:text-brand-600 transition-colors" size={20} />
                <p className="text-xl font-bold text-slate-800 group-hover:text-brand-700 transition-colors">{user.totalBookings}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Bookings</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center group hover:bg-emerald-50 hover:border-emerald-100 transition-all cursor-default">
                <CreditCard className="mb-2 text-slate-400 group-hover:text-emerald-600 transition-colors" size={20} />
                <p className="text-xl font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">$1,240</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Spent</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center group hover:bg-amber-50 hover:border-amber-100 transition-all cursor-default">
                <Clock className="mb-2 text-slate-400 group-hover:text-amber-600 transition-colors" size={20} />
                <p className="text-xl font-bold text-slate-800 group-hover:text-amber-700 transition-colors">2h ago</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Active</p>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-5 gap-8">
              {/* Left Column: Info (3/5) */}
              <div className="col-span-3 space-y-8">
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-4 bg-brand-500 rounded-full" />
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Contact Details</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-600 shadow-sm border border-slate-100">
                        <Mail size={18} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Email Address</p>
                        <p className="text-sm font-semibold text-slate-700 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-600 shadow-sm border border-slate-100">
                        <Phone size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Phone Number</p>
                        <p className="text-sm font-semibold text-slate-700">{user.phone}</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-4 bg-brand-500 rounded-full" />
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Recent Activity</h4>
                  </div>
                  <div className="relative space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                    {[
                      { action: 'Rented Tesla Model 3', date: 'Oct 12, 2023', icon: <History size={10} />, color: 'bg-brand-500' },
                      { action: 'Payment Successful', date: 'Oct 12, 2023', icon: <CreditCard size={10} />, color: 'bg-emerald-500' },
                      { action: 'Profile Updated', date: 'Sep 28, 2023', icon: <UserIcon size={10} />, color: 'bg-amber-500' }
                    ].map((item, i) => (
                      <div key={i} className="relative flex items-start gap-4 pl-8">
                        <div className={cn(
                          "absolute left-0 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-lg z-10",
                          item.color
                        )}>
                          {item.icon}
                        </div>
                        <div className="flex-1 p-3 rounded-xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-md hover:border-brand-100 transition-all cursor-default">
                          <p className="text-sm font-bold text-slate-700">{item.action}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Column: Meta (2/5) */}
              <div className="col-span-2 space-y-8">
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-4 bg-brand-500 rounded-full" />
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Account Info</h4>
                  </div>
                  <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-xl space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-brand-400 border border-white/10">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Joined</p>
                        <p className="text-sm font-bold">{format(new Date(user.joinDate), 'MMMM yyyy')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-brand-400 border border-white/10">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Location</p>
                        <p className="text-sm font-bold">San Francisco, CA</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-4 bg-brand-500 rounded-full" />
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Quick Actions</h4>
                  </div>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-brand-500 hover:text-brand-600 transition-all group">
                      <span className="text-sm font-bold">Send Email</span>
                      <Mail size={16} className="text-slate-400 group-hover:text-brand-500" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-brand-500 hover:text-brand-600 transition-all group">
                      <span className="text-sm font-bold">Call Customer</span>
                      <Phone size={16} className="text-slate-400 group-hover:text-brand-500" />
                    </button>
                  </div>
                </section>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Status: Active</span>
              </div>
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
              >
                Close Profile
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UserDetailsModal;
