import React, { useState } from 'react';
import { VEHICLES, BOOKINGS, CUSTOMERS } from '../data';
import { MoreVertical, Filter, Plus, Search, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import VehicleReturnModal from './VehicleReturnModal';
import { Vehicle, Booking } from '../types';

const VehicleList: React.FC = () => {
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleOpenReturn = (vehicle: Vehicle) => {
    // Find the active booking for this vehicle
    const activeBooking = BOOKINGS.find(b => b.vehicleId === vehicle.id && b.status === 'Confirmed');
    if (activeBooking) {
      setSelectedVehicle(vehicle);
      setSelectedBooking(activeBooking);
      setIsReturnModalOpen(true);
    }
  };

  const handleCloseReturn = () => {
    setIsReturnModalOpen(false);
    setSelectedVehicle(null);
    setSelectedBooking(null);
  };

  const getCustomer = (id: string) => CUSTOMERS.find(c => c.id === id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Vehicle Fleet</h2>
          <p className="text-slate-500">Manage and monitor your entire rental fleet.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm">
          <Plus size={18} />
          Add Vehicle
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by model, plate..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
              <Filter size={18} />
              Filters
            </button>
            <select className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 outline-none">
              <option>All Types</option>
              <option>Electric</option>
              <option>SUV</option>
              <option>Luxury</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">License Plate</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price/Day</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {VEHICLES.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                        <img 
                          src={vehicle.image} 
                          alt={vehicle.model} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{vehicle.make} {vehicle.model}</p>
                        <p className="text-xs text-slate-500">{vehicle.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{vehicle.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-medium bg-slate-100 px-2 py-1 rounded border border-slate-200 text-slate-700">
                      {vehicle.licensePlate}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-800">${vehicle.pricePerDay}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      vehicle.status === 'Available' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                      vehicle.status === 'Rented' ? "bg-brand-50 text-brand-700 border border-brand-100" :
                      "bg-amber-50 text-amber-700 border border-amber-100"
                    )}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {vehicle.status === 'Rented' && (
                        <button 
                          onClick={() => handleOpenReturn(vehicle)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-700 rounded-lg text-xs font-bold border border-brand-100 hover:bg-brand-100 transition-all"
                          title="Process Vehicle Return"
                        >
                          <RotateCcw size={14} />
                          Return
                        </button>
                      )}
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing 5 of 142 vehicles</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>

      <VehicleReturnModal 
        isOpen={isReturnModalOpen}
        onClose={handleCloseReturn}
        booking={selectedBooking}
        vehicle={selectedVehicle}
        customer={selectedBooking ? getCustomer(selectedBooking.customerId) || null : null}
      />
    </div>
  );
};

export default VehicleList;
