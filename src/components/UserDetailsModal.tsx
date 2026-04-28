import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Shield,
  Activity,
  Trash2,
  Edit2,
} from "lucide-react";
import { User } from "../types";
import { cn } from "../lib/utils";
import { format } from "date-fns";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onDelete: () => void;
  onEdit: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  user,
  onDelete,
  onEdit,
}) => {
  if (!isOpen || !user) return null;

  const roleColors = {
    Admin: "bg-purple-50 text-purple-700 border-purple-100",
    Manager: "bg-blue-50 text-blue-700 border-blue-100",
    Staff: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Customer: "bg-slate-50 text-slate-700 border-slate-100",
  };

  const statusColors = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Inactive: "bg-slate-50 text-slate-700 border-slate-100",
    Suspended: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-100 text-brand-600 rounded-lg">
                <UserIcon size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  User Profile
                </h3>
                <p className="text-xs text-slate-500 font-mono uppercase">
                  ID: {user.id}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-8">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden mb-4 bg-slate-100">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h4 className="text-xl font-bold text-slate-800">{user.name}</h4>
              <div className="flex gap-2 mt-2">
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-bold border",
                    roleColors[user.role],
                  )}
                >
                  {user.role}
                </span>
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-bold border",
                    statusColors[user.status],
                  )}
                >
                  {user.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Shield size={14} className="text-brand-600" />
                  Account Information
                </h5>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-slate-400" />
                      <span className="text-sm text-slate-600">
                        Email Address
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">
                      {user.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-slate-400" />
                      <span className="text-sm text-slate-600">
                        Phone Number
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">
                      {user.phone}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-slate-400" />
                      <span className="text-sm text-slate-600">
                        Member Since
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">
                      {format(new Date(user.joinDate), "MMMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <button
              onClick={onDelete}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete User
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={onEdit}
                className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 flex items-center gap-2"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UserDetailsModal;
