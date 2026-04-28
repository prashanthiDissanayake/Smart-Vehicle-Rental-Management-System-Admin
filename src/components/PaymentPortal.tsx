import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  CreditCard,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
  RefreshCcw,
  Navigation,
  Baby,
  Users,
  Wifi,
  DollarSign,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Payment, User, Booking, Vehicle, Driver } from "../types";
import { DRIVERS } from "../data";
import { use } from "framer-motion/client";

interface PaymentPortalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
  user: User | null;
  booking: Booking | null;
  vehicle: Vehicle | null;
  onSuccess: (payment: Payment) => void;
}

const PaymentPortal: React.FC<PaymentPortalProps> = ({
  isOpen,
  onClose,
  payment,
  user,
  booking,
  vehicle,
  onSuccess,
}) => {
  const [step, setStep] = useState<
    "details" | "review" | "processing" | "success"
  >("details");
  const [method, setMethod] = useState<
    "Bank Transfer" | "Card Payment" | "Cash"
  >("Bank Transfer");

  // Card states
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState(user?.name || "");
  const [paymentAmount, setPaymentAmount] = useState<string>("");

  useEffect(() => {
    if (isOpen && payment) {
      setStep("details");
      setNameOnCard(user?.name || "");
      setPaymentAmount(payment.amount.toString());
      if (payment?.method === "Cash") setMethod("Cash");
      else if (payment?.method === "Credit Card") setMethod("Card Payment");
      else setMethod("Bank Transfer");
    }
  }, [isOpen, user, payment]);

  function validateCardNumber(cardNumber) {
    cardNumber = cardNumber.replace(/\s+/g, "");

    if (!/^\d{16}$/.test(cardNumber)) return "Card must be 16 digits";

    return null;
  }

  function validateExpiry(expiry) {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return "Format MM/YY";

    const [month, year] = expiry.split("/");
    const expDate = new Date(`20${year}`, month - 1);
    const today = new Date();

    if (month < 1 || month > 12) return "Invalid month";
    if (expDate <= today) return "Card expired";

    return null;
  }

  function validateCVV(cvv) {
    if (!/^\d{3}$/.test(cvv)) return "CVV must be 3 digits";
    return null;
  }

  const handleProcessPayment = async () => {
    if (method === "Card Payment") {
      if (nameOnCard === "") return alert("Name on card is required");

      let error =
        validateCardNumber(cardNumber) ||
        validateExpiry(expiry) ||
        validateCVV(cvv);

      if (error) {
        alert(error);
        return;
      }
    }
    if (step === "details") {
      setStep("review");
      return;
    }

    setStep("processing");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (payment) {
      if (Number(paymentAmount) == ( payment.finalCost - payment.ad_amount)){
        console.log("test1");
        onSuccess({
          ...payment,
          amount: payment.amount,
          ad_amount: Number(paymentAmount),
          status: "Paid",
          method: method === "Card Payment" ? "Credit Card" : method,
          date: new Date().toISOString().split("T")[0],
        });
        setStep("success");
      }else{
        console.log("test2");
        
        onSuccess({
          ...payment,
          amount: payment.amount,
          ad_amount: Number(paymentAmount),
          status: "Partially_Paid",
          method: method === "Card Payment" ? "Credit Card" : method,
          date: new Date().toISOString().split("T")[0],
        });
        setStep("success");
      }
      
    }
  };

  if (!isOpen || !payment) return null;

  const isSettlement = payment.id.includes("SET");
  const startDate = booking ? new Date(booking.startDate) : new Date();
  const endDate = booking ? new Date(booking.endDate) : new Date();
  const duration = Math.max(
    1,
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    ),
  );

  const selectedDriver = booking?.driverId
    ? DRIVERS.find((d) => d.id === booking.driverId)
    : null;
  const vehicleCost = vehicle ? duration * vehicle.pricePerDay : 0;
  const driverCost = selectedDriver ? duration * selectedDriver.pricePerDay : 0;
  const addOnsCost = booking?.addOns?.reduce((sum, a) => sum + a.price, 0) || 0;
  const extraAmount = isSettlement ? payment.amount : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto items-start py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-start relative"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 lg:-right-12 w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-xl z-10 transition-all hover:scale-110"
          >
            <X size={20} />
          </button>

          {/* Left Column: Payment Method or Review */}
          <div className="flex-1 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-10">
              {step === "details" ? (
                <>
                  <button
                    onClick={onClose}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-8 text-sm font-bold"
                  >
                    <ArrowRight size={16} className="rotate-180" />
                    Back
                  </button>

                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-black text-slate-900">
                      Payment Details
                    </h2>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Total Due
                      </p>
                      <p className="text-xl font-black text-slate-900">
                        Rs.{payment.finalCost - payment.ad_amount}
                      </p>
                    </div>
                  </div>

                  {/* Advance Payment Input */}
                  <div className="mb-10 p-8 bg-brand-50/30 rounded-[2rem] border border-brand-100/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                      <DollarSign size={120} className="text-brand-600" />
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <label className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
                            <DollarSign size={16} />
                          </div>
                          Amount to Pay
                        </label>
                        {Number(paymentAmount) < payment.amount && (
                          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-wider animate-pulse">
                            Advance Payment
                          </span>
                        )}
                      </div>

                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-2xl">
                          Rs.
                        </span>
                        <input
                          type="number"
                          className="w-full pl-16 pr-6 py-6 bg-white border-2 border-slate-100 rounded-2xl text-slate-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all font-black text-3xl shadow-sm"
                          value={paymentAmount}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (
                              Number(val) <=
                              payment.finalCost - payment.ad_amount
                            ) {
                              setPaymentAmount(val);
                            }
                          }}
                          placeholder="0.00"
                        />
                      </div>

                      <div className="mt-4 flex items-center justify-between px-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          {Number(paymentAmount) < payment.amount ? (
                            <>
                              Remaining Balance:{" "}
                              <span className="text-brand-600">
                                Rs.
                                {(
                                  payment.amount -
                                  payment.ad_amount -
                                  Number(paymentAmount)
                                ).toLocaleString()}
                              </span>
                            </>
                          ) : (
                            "Paying full amount"
                          )}
                        </p>
                        <button
                          onClick={() =>
                            setPaymentAmount(
                              payment.finalCost - payment.ad_amount,
                            )
                          }
                          className="text-[10px] font-black text-brand-600 uppercase tracking-widest hover:underline"
                        >
                          Pay Full Amount
                        </button>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <CreditCard size={18} className="text-brand-600" />
                    Select Payment Method
                  </h3>

                  {/* Tabs */}
                  <div className="flex gap-4 mb-10">
                    {[
                      { id: "Bank Transfer", icon: <RefreshCcw size={20} /> },
                      { id: "Card Payment", icon: <CreditCard size={20} /> },
                      { id: "Cash", icon: <AlertCircle size={20} /> },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setMethod(m.id as any)}
                        className={cn(
                          "flex-1 flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all",
                          method === m.id
                            ? "border-brand-600 bg-brand-50/30 text-brand-600 shadow-lg shadow-brand-100"
                            : "border-slate-100 bg-white text-slate-400 hover:border-slate-200",
                        )}
                      >
                        {m.icon}
                        <span className="text-xs font-bold">{m.id}</span>
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {method === "Bank Transfer" && (
                      <motion.div
                        key="bank"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                      >
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                          <div className="flex items-center gap-3 text-brand-600 mb-6">
                            <RefreshCcw size={20} />
                            <h3 className="font-black text-sm uppercase tracking-wider">
                              Bank Transfer Details
                            </h3>
                          </div>

                          <div className="space-y-4">
                            {[
                              { label: "Bank Name", value: "People's Bank" },
                              { label: "Branch", value: "Colombo" },
                              {
                                label: "Account Number",
                                value: "8829 1002 4491",
                              },
                              {
                                label: "Account Name",
                                value: "VehicleHub",
                                highlight: true,
                              },
                            ].map((item) => (
                              <div
                                key={item.label}
                                className="flex justify-between items-center"
                              >
                                <span className="text-sm font-bold text-slate-400">
                                  {item.label}
                                </span>
                                <span
                                  className={cn(
                                    "text-sm font-black",
                                    item.highlight
                                      ? "text-brand-600"
                                      : "text-slate-900",
                                  )}
                                >
                                  {item.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed font-medium">
                          Please transfer the total amount to the account above.
                          Use the above account number to ensure your payment is
                          processed quickly. Your payment will be confirmed once
                          funds are received.
                        </p>

                        <button
                          onClick={handleProcessPayment}
                          className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                        >
                          Continue to Review
                        </button>
                      </motion.div>
                    )}

                    {method === "Card Payment" && (
                      <motion.div
                        key="card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                              Card Number
                            </label>
                            <input
                              type="text"
                              placeholder="0000 0000 0000 0000"
                              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 outline-none focus:ring-4 focus:ring-brand-500/10 transition-all font-medium"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                                Expiry
                              </label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 outline-none focus:ring-4 focus:ring-brand-500/10 transition-all font-medium"
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                                CVV
                              </label>
                              <input
                                type="password"
                                placeholder="***"
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 outline-none focus:ring-4 focus:ring-brand-500/10 transition-all font-medium"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleProcessPayment}
                          className="w-full py-5 bg-brand-600 text-white rounded-2xl font-black text-sm hover:bg-brand-700 transition-all shadow-xl shadow-brand-100"
                        >
                          Continue to Review
                        </button>
                      </motion.div>
                    )}

                    {method === "Cash" && (
                      <motion.div
                        key="cash"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                        <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100 flex items-start gap-4">
                          <AlertCircle
                            className="text-amber-600 shrink-0"
                            size={24}
                          />
                          <div>
                            <h3 className="font-black text-amber-900 mb-2">
                              Cash Payment
                            </h3>
                            <p className="text-sm text-amber-700 leading-relaxed">
                              Please hand over the total amount to our staff at
                              the counter. They will confirm the payment in the
                              system once received.
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={handleProcessPayment}
                          className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                        >
                          Continue to Review
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <button
                    onClick={() => setStep("details")}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-8 text-sm font-bold"
                  >
                    <ArrowRight size={16} className="rotate-180" />
                    Back to Payment Method
                  </button>

                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900">
                        Review & Confirm
                      </h2>
                      <p className="text-slate-500 mt-1">
                        Please verify your booking details before final payment.
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Payment Method
                      </p>
                      <p className="text-sm font-black text-brand-600">
                        {method}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 space-y-6">
                    {/* Vehicle Detail */}
                    {vehicle && (
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-20 rounded-2xl bg-white overflow-hidden border border-slate-200 shadow-sm">
                          <img
                            src={vehicle.image}
                            alt={vehicle.model}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-black text-slate-900">
                            {vehicle.make} {vehicle.model}
                          </h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                              {vehicle.type}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                              {duration} Days
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-slate-900">
                            Rs.{vehicleCost.toLocaleString()}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Base Fare
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Driver Detail */}
                    {selectedDriver && (
                      <div className="flex items-center gap-6 pt-6 border-t border-slate-200/60">
                        <div className="w-16 h-16 rounded-full bg-white overflow-hidden border-2 border-white shadow-sm">
                          <img
                            src={selectedDriver.avatar}
                            alt={selectedDriver.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-black text-slate-900">
                            {selectedDriver.name}
                          </h3>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                            Professional Driver Service
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-slate-900">
                            Rs.{driverCost.toLocaleString()}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Service Fee
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Add-ons Detail */}
                    {booking?.addOns && booking.addOns.length > 0 && (
                      <div className="pt-6 border-t border-slate-200/60 space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Selected Add-ons
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          {booking.addOns.map((addon) => (
                            <div
                              key={addon.id}
                              className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100"
                            >
                              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                {addon.name.includes("GPS") ? (
                                  <Navigation size={14} />
                                ) : addon.name.includes("Seat") ? (
                                  <Baby size={14} />
                                ) : addon.name.includes("Insurance") ? (
                                  <ShieldCheck size={14} />
                                ) : addon.name.includes("Driver") ? (
                                  <Users size={14} />
                                ) : (
                                  <Wifi size={14} />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-[10px] font-bold text-slate-900">
                                  {addon.name}
                                </p>
                                <p className="text-[10px] font-black text-brand-600">
                                  Rs.{addon.price.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Settlement Detail */}
                    {isSettlement && (
                      <div className="flex items-center gap-6 pt-6 border-t border-slate-200/60">
                        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                          <AlertCircle size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-black text-slate-900">
                            Settlement / Damages
                          </h3>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                            Additional Charges
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-amber-600">
                            Rs.{extraAmount.toLocaleString()}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Extra Amount
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-8 bg-brand-600 rounded-3xl text-white shadow-xl shadow-brand-100">
                    <div>
                      <p className="text-xs font-bold text-brand-100 uppercase tracking-widest mb-1">
                        {Number(paymentAmount) < payment.amount
                          ? "Advance Payment Amount"
                          : "Final Amount to Pay"}
                      </p>
                      <h3 className="text-4xl font-black">
                        Rs.{Number(paymentAmount).toLocaleString()}
                      </h3>
                    </div>
                    <button
                      onClick={handleProcessPayment}
                      className="px-10 py-5 bg-white text-brand-600 rounded-2xl font-black text-sm hover:bg-brand-50 transition-all flex items-center gap-2 shadow-lg"
                    >
                      Confirm & Pay Now
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Column: Payment Summary */}
          <div className="w-full lg:w-[400px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 p-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900">
                Payment Summary
              </h2>
              <span className="px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                {duration} Days
              </span>
            </div>

            <div className="space-y-6 mb-10">
              {/* Main Item: Vehicle */}
              {vehicle && (
                <div className="flex items-center gap-4">
                  <div className="w-20 h-16 rounded-2xl bg-slate-100 overflow-hidden border border-slate-100">
                    <img
                      src={vehicle.image}
                      alt={vehicle.model}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-black text-slate-900">
                      {vehicle.model}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                      {duration} Days x Rs.
                      {vehicle.pricePerDay.toLocaleString()}
                    </p>
                  </div>
                  <span className="text-sm font-black text-slate-900">
                    Rs.{vehicleCost.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Driver */}
              {selectedDriver && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-100">
                    <img
                      src={selectedDriver.avatar}
                      alt={selectedDriver.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs font-bold text-slate-900">
                      {selectedDriver.name}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                      {duration} Days x Rs.
                      {selectedDriver.pricePerDay.toLocaleString()}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    Rs.{driverCost.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Add-ons */}
              {booking?.addOns && booking.addOns.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Selected Add-ons
                    </p>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold">
                      {booking.addOns.length} Items
                    </span>
                  </div>
                  <div className="space-y-3">
                    {booking.addOns.map((addon) => (
                      <div
                        key={addon.id}
                        className="flex items-center gap-4 group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors">
                          {addon.name.includes("GPS") ? (
                            <Navigation size={16} />
                          ) : addon.name.includes("Seat") ? (
                            <Baby size={16} />
                          ) : addon.name.includes("Insurance") ? (
                            <ShieldCheck size={16} />
                          ) : addon.name.includes("Driver") ? (
                            <Users size={16} />
                          ) : (
                            <Wifi size={16} />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-slate-700">
                            {addon.name}
                          </h4>
                        </div>
                        <span className="text-xs font-black text-slate-900">
                          Rs.{addon.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Damage */}
              {payment?.damages && payment.damages.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Extra Changes
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 group">
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-slate-700">
                          Extra Km ({payment.mileage} km * 100)
                        </h4>
                      </div>
                      <span className="text-xs font-black text-slate-900">
                        Rs.{payment.mileage * 100}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 group">
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-slate-700">
                          Late Return
                        </h4>
                      </div>
                      <span className="text-xs font-black text-slate-900">
                        Rs.{payment.lateFee}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {payment.damages.map((damage) => (
                      <div
                        key={damage.id}
                        className="flex items-center gap-4 group"
                      >
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-slate-700">
                            {damage.part} - {damage.severity} (Damage)
                          </h4>
                        </div>
                        <span className="text-xs font-black text-slate-900">
                          Rs.{damage.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-400">
                  Subtotal
                </span>
                <span className="text-sm font-black text-slate-900">
                  Rs.{payment.finalCost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-400">
                  Advance Paid
                </span>
                <span className="text-sm font-black text-slate-900">
                  Rs.{payment.ad_amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-xl font-black text-slate-900">Total</span>
                <span className="text-2xl font-black text-slate-900">
                  Rs.{payment.finalCost - payment.ad_amount}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Processing Overlay */}
        <AnimatePresence>
          {step === "processing" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center text-white"
            >
              <Loader2 className="animate-spin mb-6" size={48} />
              <h3 className="text-2xl font-black">Processing Payment</h3>
              <p className="text-slate-400 mt-2">
                Securely authorizing your transaction...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Overlay */}
        <AnimatePresence>
          {step === "success" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-[110] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-full max-w-lg bg-white rounded-[3rem] overflow-hidden shadow-2xl"
              >
                {/* Header */}
                <div className="bg-brand-600 p-10 text-center text-white relative">
                  <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                    <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white blur-3xl" />
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white blur-3xl" />
                  </div>
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                    <CheckCircle2 size={40} className="text-white" />
                  </div>
                  <h3 className="text-3xl font-black mb-2">
                    Payment Successful!
                  </h3>
                  <p className="text-brand-100 font-bold">
                    Transaction ID: #PAY-
                    {Math.floor(100000 + Math.random() * 900000)}
                  </p>
                </div>

                {/* Receipt Content */}
                <div className="p-10 space-y-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">
                      Receipt Summary
                    </p>

                    {/* Vehicle */}
                    {vehicle && (
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-black text-slate-900">
                            {vehicle.make} {vehicle.model}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            {duration} Days Rental
                          </p>
                        </div>
                        <p className="text-sm font-black text-slate-900">
                          Rs.{vehicleCost.toLocaleString()}
                        </p>
                      </div>
                    )}

                    {/* Driver */}
                    {selectedDriver && (
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-black text-slate-900">
                            Driver: {selectedDriver.name}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            Professional Service
                          </p>
                        </div>
                        <p className="text-sm font-black text-slate-900">
                          Rs.{driverCost.toLocaleString()}
                        </p>
                      </div>
                    )}

                    {/* Add-ons */}
                    {booking?.addOns && booking.addOns.length > 0 && (
                      <div className="space-y-2 pt-2">
                        {booking.addOns.map((addon) => (
                          <div
                            key={addon.id}
                            className="flex justify-between items-center"
                          >
                            <p className="text-xs font-bold text-slate-500">
                              {addon.name}
                            </p>
                            <p className="text-xs font-bold text-slate-700">
                              Rs.{addon.price.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Settlement */}
                    {isSettlement && (
                      <div className="flex justify-between items-center pt-2 text-brand-600">
                        <p className="text-xs font-black uppercase tracking-wider">
                          Settlement Charges
                        </p>
                        <p className="text-sm font-black">
                          Rs.{extraAmount.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="pt-6 border-t-2 border-dashed border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {Number(paymentAmount) < payment.amount
                          ? "Advance Paid"
                          : "Total Amount Paid"}
                      </p>
                      <p className="text-xs font-bold text-brand-600">
                        via {method}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-slate-900">
                        Rs.{Number(paymentAmount).toLocaleString()}
                      </p>
                      {Number(paymentAmount) < payment.amount && (
                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mt-1">
                          Balance: Rs.
                          {(
                            payment.amount - Number(paymentAmount)
                          ).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
                  >
                    Return to Dashboard
                    <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};

export default PaymentPortal;
