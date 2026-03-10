import React, { useState } from 'react';
import { BOOKINGS, VEHICLES, CUSTOMERS } from '../data';
import { MoreVertical, Search, Calendar, CheckCircle2, Clock, XCircle, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import VehicleReturnModal from './VehicleReturnModal';
import { Booking } from '../types';

const BookingList: React.FC = () => {
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const getVehicle = (id: string) => VEHICLES.find(v => v.id === id);
  const getCustomer = (id: string) => CUSTOMERS.find(c => c.id === id);

  const handleOpenReturn = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsReturnModalOpen(true);
  };

  const handleCloseReturn = () => {
    setIsReturnModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Rental Bookings</h2>
          <p className="text-slate-500">Track and manage all customer reservations.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            Export CSV
          </button>
          <button className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm">
            New Booking
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by booking ID, customer..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
              All Status
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {BOOKINGS.map((booking) => {
                const vehicle = getVehicle(booking.vehicleId);
                const customer = getCustomer(booking.customerId);
                
                return (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono font-medium text-slate-500">#{booking.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                          <img src={customer?.avatar} alt={customer?.name} referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{customer?.name}</p>
                          <p className="text-xs text-slate-500">{customer?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        <span className="text-sm text-slate-700">{vehicle?.make} {vehicle?.model}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">
                        <p>{format(new Date(booking.startDate), 'MMM d')}</p>
                        <p className="text-xs text-slate-400">to {format(new Date(booking.endDate), 'MMM d, yyyy')}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-800">${booking.totalAmount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
                        booking.status === 'Completed' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                        booking.status === 'Confirmed' ? "bg-brand-50 text-brand-700 border border-brand-100" :
                        booking.status === 'Pending' ? "bg-amber-50 text-amber-700 border border-amber-100" :
                        "bg-red-50 text-red-700 border border-red-100"
                      )}>
                        {booking.status === 'Completed' && <CheckCircle2 size={12} />}
                        {booking.status === 'Pending' && <Clock size={12} />}
                        {booking.status === 'Cancelled' && <XCircle size={12} />}
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {booking.status === 'Confirmed' && (
                          <button 
                            onClick={() => handleOpenReturn(booking)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-700 rounded-lg text-xs font-bold border border-brand-100 hover:bg-brand-100 transition-all"
                          >
                            <RotateCcw size={14} />
                            Process Return
                          </button>
                        )}
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <VehicleReturnModal 
        isOpen={isReturnModalOpen}
        onClose={handleCloseReturn}
        booking={selectedBooking}
        vehicle={selectedBooking ? getVehicle(selectedBooking.vehicleId) || null : null}
        customer={selectedBooking ? getCustomer(selectedBooking.customerId) || null : null}
      />
    </div>
  );
};

export default BookingList;
