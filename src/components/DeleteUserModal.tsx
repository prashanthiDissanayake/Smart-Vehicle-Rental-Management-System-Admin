import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Loader2, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { deleteUser } from '../services/api';
import { User } from '../types';

interface DeleteUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ user, isOpen, onClose, onSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    try {
      await deleteUser(user.id);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to delete user", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden"
        >
          <div className="p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={32} />
            </div>
            
            <h3 className="text-xl font-bold text-slate-800">Delete User?</h3>
            <p className="text-slate-500 mt-2">
              Are you sure you want to delete <span className="font-bold text-slate-700">{user.name}</span>? 
              This action cannot be undone and all associated data will be lost.
            </p>

            <div className="flex flex-col gap-3 mt-8">
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className={cn(
                  "w-full py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2",
                  isDeleting && "opacity-70 cursor-not-allowed"
                )}
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Yes, Delete User
                  </>
                )}
              </button>
              
              <button 
                onClick={onClose}
                disabled={isDeleting}
                className="w-full py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
          >
            <X size={18} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeleteUserModal;
