import React, { useState } from 'react';
import { MoreVertical, Search, Calendar, CheckCircle2, Clock, XCircle, RotateCcw, Eye, Edit2, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import BookingDetailsModal from './BookingDetailsModal';
import EditBookingModal from './EditBookingModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { Booking, Vehicle, User } from '../types';

interface BookingListProps {
  bookings: Booking[];
  vehicles: Vehicle[];
  users: User[];
  onNewBooking?: () => void;
  onUpdate: (booking: Booking) => void;
  onDelete: (id: string) => void;
  onInitiateReturn: (bookingId: string) => void;
}

const BookingList: React.FC<BookingListProps> = ({ bookings, vehicles, users, onNewBooking, onUpdate, onDelete, onInitiateReturn }) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const getVehicle = (id: string) => vehicles.find(v => v.id === id);
  const getUser = (id: string) => users.find(u => u.id === id);

  console.log(users);
  console.log(bookings);
  

  const handleOpenReturn = (e: React.MouseEvent, booking: Booking) => {
    e.stopPropagation();
    onInitiateReturn(booking.id);
  };

  const handleOpenDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, booking: Booking) => {
    e.stopPropagation();
    setSelectedBooking(booking);
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (e: React.MouseEvent, booking: Booking) => {
    e.stopPropagation();
    setSelectedBooking(booking);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedBooking) {
      onDelete(selectedBooking.id);
      setIsDeleteModalOpen(false);
      setIsDetailsModalOpen(false);
      setSelectedBooking(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Rental Bookings</h2>
          <p className="text-slate-500">Track and manage all user reservations.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            Export CSV
          </button>
          <button 
            onClick={onNewBooking}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm"
          >
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
              placeholder="Search by booking ID, user..." 
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
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Array.isArray(bookings) && bookings.map((booking) => {
                const vehicle = getVehicle(booking.vehicleId);
                const user = getUser(booking.userId);
                
                return (
                  <tr 
                    key={booking.id} 
                    onClick={() => handleOpenDetails(booking)}
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono font-medium text-slate-500">#{booking.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                          <img src={user?.avatar} alt={user?.name} referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                          <p className="text-xs text-slate-500">{user?.email}</p>
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
                      <span className="text-sm font-bold text-slate-800">Rs.{booking.totalAmount}</span>
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
                            onClick={(e) => handleOpenReturn(e, booking)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-700 rounded-lg text-xs font-bold border border-brand-100 hover:bg-brand-100 transition-all"
                          >
                            <RotateCcw size={14} />
                            Return
                          </button>
                        )}
                        <button 
                          onClick={(e) => handleOpenEdit(e, booking)}
                          className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                          title="Edit Booking"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={(e) => handleOpenDelete(e, booking)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Booking"
                        >
                          <Trash2 size={18} />
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

      <BookingDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        booking={selectedBooking}
        user={selectedBooking ? getUser(selectedBooking.userId) || null : null}
        vehicle={selectedBooking ? getVehicle(selectedBooking.vehicleId) || null : null}
        onEdit={() => {
          setIsDetailsModalOpen(false);
          setIsEditModalOpen(true);
        }}
        onDelete={() => {
          setIsDetailsModalOpen(false);
          setIsDeleteModalOpen(true);
        }}
      />

      <EditBookingModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={onUpdate}
        booking={selectedBooking}
      />

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This action cannot be undone and will remove all associated records."
        itemName={selectedBooking ? `Booking #${selectedBooking.id}` : undefined}
      />
    </div>
  );
};

export default BookingList;
