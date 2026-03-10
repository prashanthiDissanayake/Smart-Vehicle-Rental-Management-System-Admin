import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, Shield, Briefcase, UserPlus, Camera, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { createUser } from '../services/api';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Customer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createUser(formData);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setIsSuccess(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          role: 'Customer',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        });
      }, 1500);
    } catch (error) {
      console.error("Failed to create user", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-100 text-brand-600 rounded-lg">
                <UserPlus size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Add New User</h3>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-xl font-bold text-slate-800">User Created!</h4>
                <p className="text-slate-500 mt-2">{formData.name} has been added to the system.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Avatar Preview */}
                <div className="flex flex-col items-center gap-3 pb-2">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm">
                      <img src={formData.avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                    </div>
                    <button 
                      type="button"
                      className="absolute bottom-0 right-0 p-1.5 bg-brand-600 text-white rounded-full border-2 border-white shadow-sm hover:bg-brand-700 transition-colors"
                    >
                      <Camera size={12} />
                    </button>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">User Avatar</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">User Role</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'Customer', icon: User, label: 'Customer' },
                        { id: 'Staff', icon: Briefcase, label: 'Staff' },
                        { id: 'Admin', icon: Shield, label: 'Admin' }
                      ].map((role) => (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, role: role.id })}
                          className={cn(
                            "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all",
                            formData.role === role.id 
                              ? "bg-brand-50 border-brand-200 text-brand-700 shadow-sm" 
                              : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
                          )}
                        >
                          <role.icon size={16} />
                          <span className="text-[10px] font-bold uppercase">{role.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "flex-1 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 flex items-center justify-center gap-2",
                      isSubmitting && "opacity-70 cursor-not-allowed"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create User'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddUserModal;
