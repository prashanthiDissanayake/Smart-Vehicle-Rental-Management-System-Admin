import React, { useState } from "react";
import { PAYMENTS, CUSTOMERS } from "../data";
import {
  MoreVertical,
  Search,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCcw,
  RotateCcw,
} from "lucide-react";
import { cn } from "../lib/utils";
import { format } from "date-fns";
import RefundModal from "./RefundModal";
import PaymentDetailsModal from "./PaymentDetailsModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { Payment } from "../types";
import { VEHICLES, BOOKINGS } from "../data";
import { Trash2 } from "lucide-react";

const PaymentList: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>(PAYMENTS);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const getCustomer = (id: string) => CUSTOMERS.find((c) => c.id === id);
  const getBooking = (id: string) => BOOKINGS.find((b) => b.id === id);
  const getVehicle = (id: string) => VEHICLES.find((v) => v.id === id);

  const handleOpenRefund = (e: React.MouseEvent, payment: Payment) => {
    e.stopPropagation();
    setSelectedPayment(payment);
    setIsRefundModalOpen(true);
  };

  const handleOpenDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailsModalOpen(true);
  };

  const handleOpenDelete = (e: React.MouseEvent, payment: Payment) => {
    e.stopPropagation();
    setSelectedPayment(payment);
    setIsDeleteModalOpen(true);
  };

  const handleCloseRefund = () => {
    setIsRefundModalOpen(false);
    setSelectedPayment(null);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedPayment(null);
  };

  const handleCloseDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedPayment(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedPayment) {
      setPayments((prev) => prev.filter((p) => p.id !== selectedPayment.id));
      setIsDeleteModalOpen(false);
      setSelectedPayment(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Payments & Transactions
          </h2>
          <p className="text-slate-500">
            Monitor all financial transactions and payment statuses.
          </p>
        </div>
        <div className="flex gap-3">
          {/* <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            Download Invoice
          </button> */}
          <button
            onClick={(e) => handleOpenRefund(e, payments[0])}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm"
          >
            Proceed to Refund
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <div className="relative w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by transaction ID, customer..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 outline-none">
              <option>All Methods</option>
              <option>Credit Card</option>
              <option>PayPal</option>
              <option>Bank Transfer</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((payment) => {
                const customer = getCustomer(payment.customerId);

                return (
                  <tr
                    key={payment.id}
                    onClick={() => handleOpenDetails(payment)}
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono font-medium text-slate-500 uppercase">
                        {payment.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                          <img src={customer?.avatar} alt={customer?.name} referrerPolicy="no-referrer" />
                        </div> */}
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {customer?.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            Booking: #{payment.bookingId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {format(new Date(payment.date), "MMM d, yyyy")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CreditCard size={14} className="text-slate-400" />
                        {payment.method}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-800">
                        Rs.{payment.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
                          payment.status === "Paid"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : payment.status === "Pending"
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : payment.status === "Refunded"
                                ? "bg-blue-50 text-blue-700 border border-blue-100"
                                : "bg-red-50 text-red-700 border border-red-100",
                        )}
                      >
                        {payment.status === "Paid" && (
                          <CheckCircle2 size={12} />
                        )}
                        {payment.status === "Pending" && <Clock size={12} />}
                        {payment.status === "Refunded" && (
                          <RefreshCcw size={12} />
                        )}
                        {payment.status === "Failed" && (
                          <AlertCircle size={12} />
                        )}
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {payment.status === "Paid" && (
                          <button
                            onClick={(e) => handleOpenRefund(e, payment)}
                            className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                            title="Refund Transaction"
                          >
                            <RotateCcw size={18} />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleOpenDelete(e, payment)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Payment Record"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                        >
                          <MoreVertical size={18} />
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

      <RefundModal
        isOpen={isRefundModalOpen}
        onClose={handleCloseRefund}
        payment={selectedPayment}
        customer={
          selectedPayment
            ? getCustomer(selectedPayment.customerId) || null
            : null
        }
      />

      <PaymentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
        payment={selectedPayment}
        customer={
          selectedPayment
            ? getCustomer(selectedPayment.customerId) || null
            : null
        }
        booking={
          selectedPayment ? getBooking(selectedPayment.bookingId) || null : null
        }
        vehicle={
          selectedPayment
            ? getVehicle(
                getBooking(selectedPayment.bookingId)?.vehicleId || "",
              ) || null
            : null
        }
        onDelete={() => {
          setIsDetailsModalOpen(false);
          setIsDeleteModalOpen(true);
        }}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDelete}
        onConfirm={handleDeleteConfirm}
        title="Delete Payment Record"
        message="Are you sure you want to delete this payment record? This will remove the transaction history from the dashboard."
        itemName={
          selectedPayment ? `Transaction ID: ${selectedPayment.id}` : undefined
        }
      />
    </div>
  );
};

export default PaymentList;
