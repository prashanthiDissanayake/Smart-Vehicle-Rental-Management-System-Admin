import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import VehicleList from "./components/VehicleList";
import BookingList from "./components/BookingList";
import UserList from "./components/UserList";
import PaymentList from "./components/PaymentList";
import NewBooking from "./components/NewBooking";
import VehicleReturnPage from "./components/VehicleReturnPage";
import InspectionList from "./components/InspectionList";
import PaymentPortal from "./components/PaymentPortal";
import {
  Vehicle,
  Booking,
  User,
  Payment,
  Driver,
  AddOn,
  Inspection,
} from "./types";
import {
  VEHICLES,
  BOOKINGS,
  USERS,
  PAYMENTS,
  DRIVERS,
  ADD_ONS,
  INSPECTIONS,
} from "./data";
import api from "./api";
import Login from "./components/Login";

export default function App() {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("vehicles");
  const [selectedReturnBookingId, setSelectedReturnBookingId] = useState<
    string | null
  >(null);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [drivers] = useState<Driver[]>(DRIVERS);
  const [addOns] = useState<AddOn[]>(ADD_ONS);
  const [inspections, setInspections] = useState<Inspection[]>(INSPECTIONS);
  const [isNewReturn, setIsNewReturn] = useState(false);
  const [activePaymentForPortal, setActivePaymentForPortal] =
    useState<Payment | null>(null);
  const [isPortalOpen, setIsPortalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchVehicles();
    fetchBookings();
    fetchPayments();
    fetchInspections();
  }, [activeTab]);

  const fetchVehicles = async () => {
    try {
      const res = await api.get("/vehicles");

      const formatted = res.data.map((v: any) => ({
        ...v,
        id: v._id,
      }));

      setVehicles(formatted);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");

      const formattedUsers = res.data.map((user: any) => ({
        ...user,
        id: user._id,
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");

      const formatted = res.data.map((b: any) => ({
        ...b,
        id: b._id,
      }));

      setBookings(formatted);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await api.get("/payments");

      const formatted = res.data.map((p: any) => ({
        ...p,
        id: p._id,
      }));

      setPayments(formatted);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const fetchInspections = async () => {
    try {
      const res = await api.get("/return");

      const formatted = res.data.map((i: any) => ({
        ...i,
        id: i._id,
      }));

      setInspections(formatted);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddVehicle = async (vehicle: Vehicle) => {
    try {
      const res = await api.post("/vehicles", vehicle);

      const newVehicle = {
        ...res.data.vehicle,
        id: res.data.vehicle._id,
      };

      setVehicles((prev) => [newVehicle, ...prev]);
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };

  const handleUpdateVehicle = async (vehicle: Vehicle) => {
    try {
      const { id, ...rest } = vehicle;

      const res = await api.put(`/vehicles/${id}`, rest);

      const updatedVehicle = {
        ...res.data.vehicle,
        id: res.data.vehicle._id,
      };

      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? updatedVehicle : v)),
      );
    } catch (error) {
      console.error("Error updating vehicle:", error);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      await api.delete(`/vehicles/${id}`);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  const handleAddBooking = async (booking: Booking) => {
    try {
      const { id, ...payload } = booking;
      const res = await api.post("/bookings", payload);

      const savedBooking = {
        ...res.data.booking,
        id: res.data.booking._id,
      };

      setBookings((prev) => [savedBooking, ...prev]);

      setVehicles((prev) =>
        prev.map((v) =>
          v.id === savedBooking.vehicleId ? { ...v, status: "Rented" } : v,
        ),
      );

      const paymentPayload: Payment = {
        id: `p${Date.now()}`,
        bookingId: savedBooking.id,
        userId: savedBooking.userId,
        amount: savedBooking.totalAmount,
        ad_amount: 0,
        date: new Date().toISOString().split("T")[0],
        method: "Credit Card",
        status: "Pending",
      };

      const paymentRes = await api.post("/payments", paymentPayload);

      const newPayment = {
        ...paymentRes.data.payment,
        id: paymentRes.data.payment._id,
      };

      setPayments((prev) => [newPayment, ...prev]);

      // setActivePaymentForPortal(newPayment);
      // setIsPortalOpen(true);
      setActiveTab("payments");
    } catch (error) {
      console.error("Error saving booking:", error);
    }
  };

  const handleUpdateBooking = async (updatedBooking: Booking) => {
    try {
      const { id, ...payload } = updatedBooking;
      const res = await api.put(`/bookings/${id}`, payload);
      const saved = {
        ...res.data.booking,
        id: res.data.booking._id,
      };
      setBookings((prev) => prev.map((b) => (b.id === id ? saved : b)));
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      const booking = bookings.find((b) => b.id === id);
      await api.delete(`/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      if (booking) {
        setVehicles((prev) =>
          prev.map((v) =>
            v.id === booking.vehicleId ? { ...v, status: "Available" } : v,
          ),
        );
      }
      setPayments((prev) => prev.filter((p) => p.bookingId !== id));
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const handleCompleteReturn = async (
    bookingId: string,
    vehicleId: string,
    finalAmount: number,
    mileage: number,
    fuelLevel: number,
    conditionNotes: string,
    damages: any[],
  ) => {
    try {
      const payload = {
        bookingId,
        vehicleId,
        returnDate: new Date().toISOString().split("T")[0],
        mileage,
        fuelLevel,
        conditionNotes,
        damages,
        totalCharges: finalAmount,
        status: "Completed",
      };

      const res = await api.post("/return", payload);

      console.log(res);

      const newInspection = {
        ...res.data.return,
        id: res.data.return._id,
      };

      setInspections((prev) => [newInspection, ...prev]);

      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "Completed" } : b,
        ),
      );
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === vehicleId ? { ...v, status: "Available" } : v,
        ),
      );

      console.log(bookings);
      const selectedBooking = bookings.find((b) => b.id === bookingId);

      const paymentRes = await api.put(`/payments/return/${bookingId}`, {
        bookingId: bookingId,
        userId: selectedBooking.userId,
        method: "Credit Card",
        amount: finalAmount,
        date: new Date().toISOString().split("T")[0],
        status: "Pending",
      });

      const newPayment = {
        ...paymentRes.data.payment,
        id: paymentRes.data.payment._id,
      };

      setPayments((prev) => [newPayment, ...prev]);

      setActivePaymentForPortal(newPayment);
      // setIsPortalOpen(true);

      setActiveTab("payments");
    } catch (error) {
      console.error("Error completing return:", error);
    }
  };

  const handleAddUser = async (user: User) => {
    try {
      const res = await api.post("/users", user);

      const newUser = {
        ...res.data.user,
        id: res.data.user._id,
      };

      setUsers((prev) => [newUser, ...prev]);
    } catch (error: any) {
      const message =
        error.response?.data?.error || error.message || "Something went wrong";

      alert(message);
    }
  };

  const handleUpdateUser = async (user: User) => {
    console.log(user.id);

    try {
      const res = await api.put(`/users/${user.id}`, user);

      const updatedUser = {
        ...res.data.user,
        id: res.data.user._id,
      };

      setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleAddPayment = (payment: Payment) => {
    setPayments((prev) => [payment, ...prev]);
  };

  const handleUpdatePayment = async (payment: Payment) => {
    try {
      const { id, ...payload } = payment;
      const res = await api.put(`/payments/${id}`, payload);
      const updated = {
        ...res.data.payment,
        id: res.data.payment._id,
      };
      setPayments((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };

  const handleDeletePayment = async (id: string) => {
    try {
      await api.delete(`/payments/${id}`);
      setPayments((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateInspection = async (inspection: Inspection) => {
    try {
      const { id, ...payload } = inspection;
      const res = await api.put(`/return/${id}`, payload);
      const updated = {
        ...res.data.inspection,
        id: res.data.inspection._id,
      };
      setInspections((prev) => prev.map((i) => (i.id === id ? updated : i)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteInspection = async (id: string) => {
    try {
      await api.delete(`/return/${id}`);
      setInspections((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onNewBooking={() => setActiveTab("new-booking")} />;
      case "vehicles":
        return (
          <VehicleList
            vehicles={vehicles}
            bookings={bookings}
            users={users}
            onAdd={handleAddVehicle}
            onUpdate={handleUpdateVehicle}
            onDelete={handleDeleteVehicle}
            onInitiateReturn={(bookingId) => {
              setSelectedReturnBookingId(bookingId);
              setActiveTab("returns");
            }}
          />
        );
      case "bookings":
        return (
          <BookingList
            bookings={bookings}
            vehicles={vehicles}
            users={users}
            onNewBooking={() => setActiveTab("new-booking")}
            onUpdate={handleUpdateBooking}
            onDelete={handleDeleteBooking}
            onInitiateReturn={(bookingId) => {
              setSelectedReturnBookingId(bookingId);
              setActiveTab("returns");
            }}
          />
        );
      case "new-booking":
        return (
          <NewBooking
            users={users}
            vehicles={vehicles}
            drivers={drivers}
            addOns={addOns}
            onSuccess={(booking) => {
              handleAddBooking(booking);
            }}
            onCancel={() => setActiveTab("bookings")}
          />
        );
      case "users":
        return (
          <UserList
            users={users}
            onAdd={handleAddUser}
            onUpdate={handleUpdateUser}
            onDelete={handleDeleteUser}
          />
        );
      case "payments":
        return (
          <PaymentList
            payments={payments}
            bookings={bookings}
            vehicles={vehicles}
            users={users}
            onUpdate={handleUpdatePayment}
            onDelete={handleDeletePayment}
            onProcessPayment={(payment) => {
              setActivePaymentForPortal(payment);
              setIsPortalOpen(true);
            }}
          />
        );
      case "returns":
        if (isNewReturn) {
          return (
            <VehicleReturnPage
              bookings={bookings}
              vehicles={vehicles}
              payments={payments}
              users={users}
              onComplete={async (
                bookingId,
                vehicleId,
                finalAmount,
                mileage,
                fuelLevel,
                conditionNotes,
                damages,
              ) => {
                handleCompleteReturn(
                  bookingId,
                  vehicleId,
                  finalAmount,
                  mileage,
                  fuelLevel,
                  conditionNotes,
                  damages,
                );
                setSelectedReturnBookingId(null);
              }}
              onCancel={() => {
                setIsNewReturn(false);
                setSelectedReturnBookingId(null);
              }}
              preSelectedBookingId={selectedReturnBookingId}
            />
          );
        }
        return (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => setIsNewReturn(true)}
                className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm"
              >
                New Return & Inspection
              </button>
            </div>
            <InspectionList
              inspections={inspections}
              vehicles={vehicles}
              users={users}
              bookings={bookings}
              onUpdate={handleUpdateInspection}
              onDelete={handleDeleteInspection}
            />
          </div>
        );
      case "settings":
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-600">
              Settings Module
            </h3>
            <p className="text-sm">Configuration options will appear here.</p>
          </div>
        );
      default:
        return <VehicleList
            vehicles={vehicles}
            bookings={bookings}
            users={users}
            onAdd={handleAddVehicle}
            onUpdate={handleUpdateVehicle}
            onDelete={handleDeleteVehicle}
            onInitiateReturn={(bookingId) => {
              setSelectedReturnBookingId(bookingId);
              setActiveTab("returns");
            }}
          />;
    }
  };

  const token = localStorage.getItem("token");

  if (!token) {
    return <Login />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Payment Portal */}
      <PaymentPortal
        isOpen={isPortalOpen}
        onClose={() => {
          setIsPortalOpen(false);
          setActivePaymentForPortal(null);
          if (activeTab === "returns") {
            setActiveTab("payments");
          }
        }}
        payment={activePaymentForPortal}
        user={
          activePaymentForPortal
            ? users.find((u) => u.id === activePaymentForPortal.userId) || null
            : null
        }
        booking={
          activePaymentForPortal
            ? bookings.find((b) => b.id === activePaymentForPortal.bookingId) ||
              null
            : null
        }
        vehicle={
          activePaymentForPortal
            ? vehicles.find(
                (v) =>
                  v.id ===
                  bookings.find(
                    (b) => b.id === activePaymentForPortal.bookingId,
                  )?.vehicleId,
              ) || null
            : null
        }
        onSuccess={(updatedPayment) => {
          handleUpdatePayment(updatedPayment);
        }}
      />
    </div>
  );
}
