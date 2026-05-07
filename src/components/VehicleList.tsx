import React, { useState } from 'react';
import { MoreVertical, Filter, Plus, Search, RotateCcw, Edit2, Trash2, Eye } from 'lucide-react';
import { cn } from '../lib/utils';
import AddVehicleModal from './AddVehicleModal';
import EditVehicleModal from './EditVehicleModal';
import VehicleDetailsModal from './VehicleDetailsModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { Vehicle, Booking, User } from '../types';

interface VehicleListProps {
  vehicles: Vehicle[];
  bookings: Booking[];
  users: User[];
  onAdd: (vehicle: Vehicle) => void;
  onUpdate: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  onInitiateReturn: (bookingId: string) => void;
}

const VehicleList: React.FC<VehicleListProps> = ({ vehicles, bookings, users, onAdd, onUpdate, onDelete, onInitiateReturn }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [search,setSearch] = useState("")
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const handleOpenReturn = (e: React.MouseEvent, vehicle: Vehicle) => {
    e.stopPropagation();
    // Find the active booking for this vehicle
    const activeBooking = bookings.find(b => b.vehicleId === vehicle.id && b.status === 'Confirmed');
    if (activeBooking) {
      onInitiateReturn(activeBooking.id);
    }
  };

  const handleOpenDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailsModalOpen(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, vehicle: Vehicle) => {
    e.stopPropagation();
    setSelectedVehicle(vehicle);
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (e: React.MouseEvent, vehicle: Vehicle) => {
    e.stopPropagation();
    setSelectedVehicle(vehicle);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedVehicle) {
      onDelete(selectedVehicle.id);
      setIsDeleteModalOpen(false);
      setIsDetailsModalOpen(false);
      setSelectedVehicle(null);
    }
  };

  const getUser = (id: string) => users.find(u => u.id === id);

  const filteredVehicles = Array.isArray(vehicles)
  ? vehicles.filter((vehicle) => {
      const searchText = search.toLowerCase();

      return (
        vehicle.make?.toLowerCase().includes(searchText) ||
        vehicle.model?.toLowerCase().includes(searchText) ||
        vehicle.type?.toLowerCase().includes(searchText) ||
        vehicle.licensePlate?.toLowerCase().includes(searchText) ||
        vehicle.status?.toLowerCase().includes(searchText) ||
        vehicle.year?.toString().includes(searchText) ||
        vehicle.pricePerDay?.toString().includes(searchText)
      );
    })
  : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Vehicle Fleet</h2>
          <p className="text-slate-500">Manage and monitor your entire rental fleet.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm"
        >
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
              <Filter size={18} />
              Filters
            </button>
            <select value={search}
              onChange={(e) => setSearch(e.target.value)} className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 outline-none">
              <option value={""}>All Types</option>
              <option>Electric</option>
              <option>SUV</option>
              <option>Luxury</option>
              <option>Sedan</option>
              <option>Truck</option>
              <option>Van</option>
              <option>Sports</option>
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
             {filteredVehicles.map((vehicle) => (
                <tr 
                  key={vehicle.id} 
                  onClick={() => handleOpenDetails(vehicle)}
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
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
                    <span className="text-sm font-bold text-slate-800">Rs.{vehicle.pricePerDay}</span>
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
                          onClick={(e) => handleOpenReturn(e, vehicle)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-700 rounded-lg text-xs font-bold border border-brand-100 hover:bg-brand-100 transition-all"
                          title="Process Vehicle Return"
                        >
                          <RotateCcw size={14} />
                          Return
                        </button>
                      )}
                      <button 
                        onClick={(e) => handleOpenEdit(e, vehicle)}
                        className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                        title="Edit Vehicle"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={(e) => handleOpenDelete(e, vehicle)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Vehicle"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing {Array.isArray(vehicles) ? vehicles.length : 0} of 142 vehicles</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>

      <AddVehicleModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={onAdd}
      />

      <EditVehicleModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={onUpdate}
        vehicle={selectedVehicle}
      />

      <VehicleDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        vehicle={selectedVehicle}
        onEdit={() => {
          setIsDetailsModalOpen(false);
          setIsEditModalOpen(true);
        }}
        onDelete={() => {
          setIsDetailsModalOpen(false);
          setIsDeleteModalOpen(true);
        }}
      />

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Vehicle"
        message="Are you sure you want to remove this vehicle from your fleet? This action will permanently delete all associated records."
        itemName={selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.licensePlate})` : undefined}
      />
    </div>
  );
};

export default VehicleList;
