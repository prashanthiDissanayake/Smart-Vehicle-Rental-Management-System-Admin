import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  DollarSign,
  AlertCircle,
  Save,
  Currency,
} from "lucide-react";
import { Booking } from "../types";
import { cn } from "../lib/utils";
import { format } from "date-fns";

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedBooking: Booking) => void;
  booking: Booking | null;
}

const EditBookingModal: React.FC<EditBookingModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  booking,
}) => {
  const [formData, setFormData] = useState<Partial<Booking>>({});

  useEffect(() => {
    if (booking) {
      setFormData(booking);
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    if (formData.startDate > formData.endDate) {
      alert("Start date must be before end date");
      return;
    } else {
      e.preventDefault();
      onUpdate({ ...booking, ...formData } as Booking);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-100 text-brand-600 rounded-lg">
                <Calendar size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Edit Booking</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Booking Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as Booking["status"],
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all font-medium"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={
                      formData.startDate
                        ? format(new Date(formData.startDate), "yyyy-MM-dd")
                        : ""
                    }
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={
                      formData.endDate
                        ? format(new Date(formData.endDate), "yyyy-MM-dd")
                        : ""
                    }
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
              <AlertCircle className="text-amber-600 shrink-0" size={18} />
              <p className="text-xs text-amber-700 leading-relaxed">
                Changing the booking status or dates may affect vehicle
                availability and financial reports. Please verify changes before
                saving.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditBookingModal;
