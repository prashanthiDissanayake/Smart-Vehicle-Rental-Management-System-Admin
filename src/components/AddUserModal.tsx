//Done
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  Lock,
  Image as ImageIcon,
} from "lucide-react";
import { User } from "../types";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: User) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "Admin",
    avatar:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80",
    status: "Active",
  });

  if (!isOpen) return null;

  function validatePassword(password) {
    const minLength = 8;
    const upperCase = /[A-Z]/;
    const lowerCase = /[a-z]/;
    const number = /[0-9]/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
      return "Password must be at least 8 characters";
    }
    if (!upperCase.test(password)) {
      return "Password must include at least one uppercase letter";
    }
    if (!lowerCase.test(password)) {
      return "Password must include at least one lowercase letter";
    }
    if (!number.test(password)) {
      return "Password must include at least one number";
    }
    if (!specialChar.test(password)) {
      return "Password must include at least one special character";
    }

    return "Valid password";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.phone.length !== 10) {
      alert("Phone number must be 10 digits");
      return;
    } else if (validatePassword(formData.password) !== "Valid password") {
      alert(validatePassword(formData.password));
      return;
    }

    const payload = {
      ...formData,
      id: `u${Math.random().toString(36).substr(2, 5)}`,
      joinDate: new Date().toISOString().split("T")[0],
    };

    try {
      onAdd(payload);
      onClose();
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "Admin",
        avatar: "",
        status: "Active",
      });
    } catch (error) {
      console.log("Error adding user:", error);
    }
  };

  const roles = ["Admin", "Customer"];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg my-8"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-600 text-white rounded-lg shadow-lg shadow-brand-200">
                <UserIcon size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Add New User
                </h3>
                <p className="text-xs text-slate-500">
                  Create a new system user or customer.
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

          <form onSubmit={handleSubmit}>
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <UserIcon size={14} className="text-brand-600" />
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Mail size={14} className="text-brand-600" />
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="type your email address"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Phone size={14} className="text-brand-600" />
                    Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Lock size={14} className="text-brand-600" />
                    Password
                  </label>
                  <input
                    required
                    type="password"
                    placeholder="**********"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Role */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <Shield size={14} className="text-brand-600" />
                      User Role
                    </label>
                    <select
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <Shield size={14} className="text-brand-600" />
                      Status
                    </label>
                    <select
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200"
              >
                Create User
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddUserModal;
