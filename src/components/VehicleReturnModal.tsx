import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Car, Fuel, AlertTriangle, Clock, DollarSign, CheckCircle2, CreditCard, Wallet } from 'lucide-react';
import { Booking, Vehicle, Customer } from '../types';
import { cn } from '../lib/utils';

interface VehicleReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  vehicle: Vehicle | null;
  customer: Customer | null;
}

const VehicleReturnModal: React.FC<VehicleReturnModalProps> = ({ isOpen, onClose, booking, vehicle, customer }) => {
  const [step, setStep] = useState<'inspection' | 'payment'>('inspection');
  const [fuelCharge, setFuelCharge] = useState<number>(0);
  const [damageCharge, setDamageCharge] = useState<number>(0);
  const [lateFee, setLateFee] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'Cash' | 'Wallet'>('Credit Card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Mock card details
  const [cardName, setCardName] = useState(customer?.name || '');
  const [cardNumber, setCardNumber] = useState('**** **** **** 4242');
  const [expiry, setExpiry] = useState('12/25');
  const [cvv, setCvv] = useState('***');

  const totalBalance = fuelCharge + damageCharge + lateFee;
  const grandTotal = (booking?.totalAmount || 0) + totalBalance;

  const handleCompleteReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      onClose();
      setIsSuccess(false);
      setStep('inspection');
      setFuelCharge(0);
      setDamageCharge(0);
      setLateFee(0);
    }, 2500);
  };

  if (!isOpen || !booking) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand-600 text-white rounded-xl shadow-lg shadow-brand-200">
                <Car size={22} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">
                  {step === 'inspection' ? 'Vehicle Inspection' : 'Payment Settlement'}
                </h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Booking #{booking.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Step Indicator */}
              <div className="hidden sm:flex items-center gap-2 mr-4">
                <div className={cn("w-2 h-2 rounded-full", step === 'inspection' ? "bg-brand-600" : "bg-brand-200")} />
                <div className={cn("w-2 h-2 rounded-full", step === 'payment' ? "bg-brand-600" : "bg-brand-200")} />
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <CheckCircle2 size={48} />
                </div>
                <h4 className="text-3xl font-black text-slate-900">Return Completed!</h4>
                <p className="text-slate-500 mt-3 max-w-xs mx-auto font-medium">
                  The vehicle has been successfully returned and the final payment of <span className="text-slate-900 font-bold">${grandTotal}</span> has been processed.
                </p>
                <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 w-full max-w-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Vehicle Status Updated</p>
                  <p className="text-sm font-bold text-emerald-600 flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} />
                    {vehicle?.make} {vehicle?.model} is now AVAILABLE
                  </p>
                </div>
              </motion.div>
            ) : step === 'inspection' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left Side: Summary */}
                <div className="space-y-8">
                  <section className="space-y-4">
                    <h5 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <Car size={16} className="text-brand-600" />
                      Rental Summary
                    </h5>
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                          <img src={vehicle?.image} alt={vehicle?.model} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{vehicle?.make} {vehicle?.model}</p>
                          <p className="text-xs text-slate-500 font-mono">{vehicle?.licensePlate}</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-slate-200/60 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Customer</span>
                          <span className="font-bold text-slate-800">{customer?.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Base Rental</span>
                          <span className="font-bold text-slate-800">${booking.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <div className="p-6 bg-slate-900 rounded-2xl text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                      <p className="text-xs font-bold text-slate-400 uppercase opacity-80 tracking-widest">Estimated Total</p>
                      <h4 className="text-4xl font-black mt-1">${grandTotal.toLocaleString()}</h4>
                      <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase">Includes base rental + extra charges</p>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-600/20 rounded-full blur-3xl"></div>
                  </div>
                </div>

                {/* Right Side: Adjustments */}
                <div className="space-y-8">
                  <h5 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle size={16} className="text-brand-600" />
                    Extra Charges
                  </h5>
                  
                  <div className="space-y-6">
                    {/* Fuel Charge */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                          <Fuel size={14} className="text-slate-400" />
                          Fuel Refill Charge
                        </label>
                        <span className="text-xs font-bold text-slate-400">${fuelCharge}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="200" 
                        step="10"
                        value={fuelCharge}
                        onChange={(e) => setFuelCharge(Number(e.target.value))}
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600"
                      />
                    </div>

                    {/* Damage Charge */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                        <AlertTriangle size={14} className="text-slate-400" />
                        Damage Assessment
                      </label>
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="number" 
                          value={damageCharge || ''}
                          onChange={(e) => setDamageCharge(Number(e.target.value))}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                          placeholder="Enter damage amount"
                        />
                      </div>
                    </div>

                    {/* Late Fee */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                        <Clock size={14} className="text-slate-400" />
                        Late Return Fee
                      </label>
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="number" 
                          value={lateFee || ''}
                          onChange={(e) => setLateFee(Number(e.target.value))}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                          placeholder="Enter late fee"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left Side: Payment Summary */}
                <div className="space-y-8">
                  <section className="space-y-4">
                    <h5 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <DollarSign size={16} className="text-brand-600" />
                      Charge Breakdown
                    </h5>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Base Rental Fee</span>
                        <span className="font-bold text-slate-800">${booking.totalAmount}</span>
                      </div>
                      {fuelCharge > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Fuel Refill</span>
                          <span className="font-bold text-slate-800">+${fuelCharge}</span>
                        </div>
                      )}
                      {damageCharge > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Damage Assessment</span>
                          <span className="font-bold text-slate-800">+${damageCharge}</span>
                        </div>
                      )}
                      {lateFee > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Late Return Fee</span>
                          <span className="font-bold text-slate-800">+${lateFee}</span>
                        </div>
                      )}
                      <div className="pt-3 mt-3 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-base font-black text-slate-800">Total Due</span>
                        <span className="text-2xl font-black text-brand-600">${grandTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h5 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <CreditCard size={16} className="text-brand-600" />
                      Payment Method
                    </h5>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'Credit Card', icon: CreditCard },
                        { id: 'Cash', icon: Wallet },
                        { id: 'Wallet', icon: DollarSign }
                      ].map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id as any)}
                          className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                            paymentMethod === method.id 
                              ? "bg-brand-50 border-brand-600 text-brand-700 shadow-md" 
                              : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                          )}
                        >
                          <method.icon size={20} />
                          <span className="text-[10px] font-black uppercase">{method.id}</span>
                        </button>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Right Side: Payment Details */}
                <div className="space-y-8">
                  {paymentMethod === 'Credit Card' ? (
                    <div className="space-y-6">
                      <h5 className="text-sm font-black text-slate-800 uppercase tracking-widest">Card Details</h5>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Cardholder Name</label>
                          <input 
                            type="text" 
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-brand-500/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Card Number</label>
                          <div className="relative">
                            <CreditCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                              type="text" 
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-brand-500/20"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Expiry</label>
                            <input 
                              type="text" 
                              value={expiry}
                              onChange={(e) => setExpiry(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-brand-500/20 text-center"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">CVV</label>
                            <input 
                              type="text" 
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-brand-500/20 text-center"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-6 bg-slate-200 rounded flex items-center justify-center text-[8px] font-bold text-slate-400">VISA</div>
                        <div className="w-10 h-6 bg-slate-200 rounded flex items-center justify-center text-[8px] font-bold text-slate-400">MC</div>
                        <p className="text-[10px] text-slate-400 font-medium">Secure 256-bit SSL encrypted payment</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                        {paymentMethod === 'Cash' ? <Wallet size={32} className="text-brand-600" /> : <DollarSign size={32} className="text-brand-600" />}
                      </div>
                      <h6 className="text-lg font-bold text-slate-800">{paymentMethod} Payment</h6>
                      <p className="text-sm text-slate-500 mt-2">Please collect the cash amount of <span className="font-bold text-slate-900">${grandTotal}</span> from the customer and confirm below.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {!isSuccess && (
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <button 
                onClick={step === 'inspection' ? onClose : () => setStep('inspection')}
                className="px-8 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-600 hover:bg-slate-50 transition-all"
              >
                {step === 'inspection' ? 'Cancel' : 'Back to Inspection'}
              </button>
              
              <button 
                onClick={step === 'inspection' ? () => setStep('payment') : handleCompleteReturn}
                disabled={isProcessing}
                className={cn(
                  "px-8 py-3 bg-brand-600 text-white rounded-2xl text-sm font-black hover:bg-brand-700 transition-all shadow-xl shadow-brand-200 flex items-center gap-3",
                  isProcessing && "opacity-70 cursor-not-allowed"
                )}
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : step === 'inspection' ? (
                  <>
                    Proceed to Payment
                    <DollarSign size={18} />
                  </>
                ) : (
                  <>
                    Complete Return & Pay
                    <CheckCircle2 size={18} />
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


const Info: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

export default VehicleReturnModal;
