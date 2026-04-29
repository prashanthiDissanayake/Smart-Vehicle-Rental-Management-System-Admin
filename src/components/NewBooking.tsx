import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  User as UserIcon,
  Car,
  Search,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  DollarSign,
  Clock,
  Plus,
  Minus,
  Navigation,
  Baby,
  ShieldCheck,
  Users,
  Wifi,
  UserCheck,
  Star,
} from "lucide-react";
import { User, Vehicle, Booking, AddOn, Driver } from "../types";
import { cn } from "../lib/utils";
import { format, differenceInDays, addDays } from "date-fns";

interface NewBookingProps {
  onSuccess: (booking: Booking) => void;
  onCancel: () => void;
  users: User[];
  vehicles: Vehicle[];
  drivers: Driver[];
  addOns: AddOn[];
}

const NewBooking: React.FC<NewBookingProps> = ({
  onSuccess,
  onCancel,
  users,
  vehicles,
  drivers,
  addOns,
}) => {
  const [step, setStep] = useState(1);
  const [driverOption, setDriverOption] = useState<"with" | "without" | null>(
    null,
  );
  const [searchUser, setSearchUser] = useState("");
  const [searchVehicle, setSearchVehicle] = useState("");
  const [searchDriver, setSearchDriver] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(
    format(addDays(new Date(), 3), "yyyy-MM-dd"),
  );

  const [vehiclePerDay, setVehiclePerDay] = useState("");
  const [driverPerDay, setDriverPerDay] = useState("");
  const [addonsTotal, setAddonsTotal] = useState("");

  const filteredDrivers = useMemo(() => {
    const available = drivers.filter((d) => d.status === "Available");
    if (!searchDriver) return available;
    return available.filter((d) =>
      d.name.toLowerCase().includes(searchDriver.toLowerCase()),
    );
  }, [searchDriver, drivers]);

  const getAddOnIcon = (iconName: string) => {
    switch (iconName) {
      case "Navigation":
        return <Navigation size={24} />;
      case "Baby":
        return <Baby size={24} />;
      case "ShieldCheck":
        return <ShieldCheck size={24} />;
      case "Users":
        return <Users size={24} />;
      case "Wifi":
        return <Wifi size={24} />;
      default:
        return <Plus size={24} />;
    }
  };

  const toggleAddOn = (addOn: AddOn) => {
    setSelectedAddOns((prev) =>
      prev.find((a) => a.id === addOn.id)
        ? prev.filter((a) => a.id !== addOn.id)
        : [...prev, addOn],
    );
  };

  const filteredUsers = useMemo(() => {
    if (!searchUser) return users.slice(0, 5);
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
        u.email.toLowerCase().includes(searchUser.toLowerCase()),
    );
  }, [searchUser, users]);

  const filteredVehicles = useMemo(() => {
    const available = vehicles.filter((v) => v.status === "Available");
    if (!searchVehicle) return available.slice(0, 5);
    return available.filter(
      (v) =>
        v.make.toLowerCase().includes(searchVehicle.toLowerCase()) ||
        v.model.toLowerCase().includes(searchVehicle.toLowerCase()),
    );
  }, [searchVehicle, vehicles]);

  const duration = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = differenceInDays(end, start);
    return days > 0 ? days : 0;
  }, [startDate, endDate]);

  const totalAmount = useMemo(() => {
    if (!selectedVehicle) return 0;
    const vehicleCost = duration * selectedVehicle.pricePerDay;
    const driverCost = selectedDriver
      ? duration * selectedDriver.pricePerDay
      : 0;
    const addOnsCost = selectedAddOns.reduce(
      (sum, addon) => sum + addon.price,
      0,
    );

    setVehiclePerDay(selectedVehicle.pricePerDay);
    setDriverPerDay(selectedDriver?.pricePerDay || 0);
    setAddonsTotal(addOnsCost);
    return vehicleCost + driverCost + addOnsCost;
  }, [selectedVehicle, duration, selectedAddOns, selectedDriver]);

  const handleConfirm = () => {
    if (!selectedUser || !selectedVehicle) return;
    const newBooking: Booking = {
      id: `B${Math.floor(1000 + Math.random() * 9000)}`,
      userId: selectedUser.id,
      vehicleId: selectedVehicle.id,
      driverId: selectedDriver?.id,
      startDate,
      endDate,
      duration,
      vehiclePerDay,
      driverPerDay,
      addonsTotal,
      totalAmount,
      status: "Confirmed",
      addOns: selectedAddOns,
    };
    console.log(newBooking);

    onSuccess(newBooking);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Create New Booking
          </h2>
          <p className="text-slate-500 mt-1">
            Follow the steps to register a new vehicle reservation.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors"
        >
          Cancel Process
        </button>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {[1, 2, 3, 4, 5].map((i) => (
          <React.Fragment key={i}>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all",
                  step === i
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-200"
                    : step > i
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-400",
                )}
              >
                {step > i ? <CheckCircle2 size={16} /> : i}
              </div>
              <span
                className={cn(
                  "text-sm font-bold",
                  step === i ? "text-slate-900" : "text-slate-400",
                )}
              >
                {i === 1
                  ? "User"
                  : i === 2
                    ? "Vehicle"
                    : i === 3
                      ? "Driver"
                      : i === 4
                        ? "Add-ons"
                        : "Confirm"}
              </span>
            </div>
            {i < 5 && <div className="flex-1 h-px bg-slate-100" />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100">
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 outline-none focus:ring-4 focus:ring-brand-500/10 transition-all font-medium"
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                  />
                </div>
              </div>
              <div className="p-2">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      setSelectedUser(user);
                      setStep(2);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl transition-all group",
                      selectedUser?.id === user.id
                        ? "bg-brand-50 border border-brand-100"
                        : "hover:bg-slate-50",
                    )}
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm bg-slate-100">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <ChevronRight
                      size={20}
                      className="text-slate-300 group-hover:text-brand-500 transition-colors"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100">
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search available vehicles..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 outline-none focus:ring-4 focus:ring-brand-500/10 transition-all font-medium"
                    value={searchVehicle}
                    onChange={(e) => setSearchVehicle(e.target.value)}
                  />
                </div>
              </div>
              <div className="p-2">
                {filteredVehicles.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setStep(3);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl transition-all group",
                      selectedVehicle?.id === vehicle.id
                        ? "bg-brand-50 border border-brand-100"
                        : "hover:bg-slate-50",
                    )}
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-20 h-14 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                        <img
                          src={vehicle.image}
                          alt={vehicle.model}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">
                          {vehicle.make} {vehicle.model}
                        </p>
                        <p className="text-xs text-slate-500">
                          {vehicle.type} • Rs.{vehicle.pricePerDay}/day
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">
                        Rs.{vehicle.pricePerDay}
                      </p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                        Per Day
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {!driverOption ? (
                <div className="grid grid-cols-2 gap-6">
                  <button
                    onClick={() => setDriverOption("without")}
                    className="bg-white rounded-[2rem] border-2 border-slate-100 p-10 text-center hover:border-brand-500 hover:bg-brand-50/30 transition-all group"
                  >
                    <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                      <Car size={40} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">
                      Self Drive
                    </h3>
                    <p className="text-sm text-slate-500">
                      I will drive the vehicle myself
                    </p>
                  </button>
                  <button
                    onClick={() => setDriverOption("with")}
                    className="bg-white rounded-[2rem] border-2 border-slate-100 p-10 text-center hover:border-brand-500 hover:bg-brand-50/30 transition-all group"
                  >
                    <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                      <Users size={40} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">
                      With Driver
                    </h3>
                    <p className="text-sm text-slate-500">
                      I need a professional driver
                    </p>
                  </button>
                </div>
              ) : driverOption === "without" ? (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">
                    Self Drive Selected
                  </h3>
                  <p className="text-slate-500 mb-8">
                    You have chosen to drive the vehicle yourself. No driver
                    will be assigned.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setDriverOption(null)}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all"
                    >
                      Change Option
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDriver(null);
                        setStep(4);
                      }}
                      className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                      Continue
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setDriverOption(null)}
                        className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <ArrowRight size={18} className="rotate-180" />
                      </button>
                      <h3 className="font-black text-slate-900">
                        Select Your Driver
                      </h3>
                    </div>
                    <div className="relative w-64">
                      <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={16}
                      />
                      <input
                        type="text"
                        placeholder="Search drivers..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                        value={searchDriver}
                        onChange={(e) => setSearchDriver(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="p-2 max-h-[400px] overflow-y-auto">
                    {filteredDrivers.map((driver) => (
                      <button
                        key={driver.id}
                        onClick={() => {
                          setSelectedDriver(driver);
                          setStep(4);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between p-4 rounded-2xl transition-all group",
                          selectedDriver?.id === driver.id
                            ? "bg-brand-50 border border-brand-100"
                            : "hover:bg-slate-50",
                        )}
                      >
                        <div className="flex items-center gap-4 text-left">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm bg-slate-100">
                            <img
                              src={driver.avatar}
                              alt={driver.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">
                              {driver.name}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center text-amber-500">
                                <Star size={12} fill="currentColor" />
                                <span className="text-xs font-bold ml-1">
                                  {driver.rating}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                • {driver.experience} Exp
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-slate-900">
                            Rs.{driver.pricePerDay}
                          </p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                            Per Day
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                <h3 className="text-xl font-black text-slate-900 mb-2">
                  Enhance the Experience
                </h3>
                <p className="text-slate-500 mb-8">
                  Select additional services and equipment for the rental.
                </p>

                <div className="grid grid-cols-1 gap-4">
                  {addOns.map((addon) => (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddOn(addon)}
                      className={cn(
                        "flex items-center gap-6 p-6 rounded-2xl border-2 transition-all text-left group",
                        selectedAddOns.find((a) => a.id === addon.id)
                          ? "border-brand-600 bg-brand-50/30"
                          : "border-slate-100 hover:border-slate-200 bg-white",
                      )}
                    >
                      <div
                        className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
                          selectedAddOns.find((a) => a.id === addon.id)
                            ? "bg-brand-600 text-white"
                            : "bg-slate-100 text-slate-400 group-hover:bg-slate-200",
                        )}
                      >
                        {getAddOnIcon(addon.icon)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900">
                          {addon.name}
                        </h4>
                        <p className="text-sm text-slate-500">
                          {addon.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-slate-900">
                          Rs.{addon.price}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          One-time
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setStep(5)}
                  className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  Continue to Review
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Date Selection */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Calendar size={20} className="text-brand-600" />
                  Select Rental Period
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Pick-up Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:ring-2 focus:ring-brand-500/20 transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Return Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:ring-2 focus:ring-brand-500/20 transition-all font-bold"
                    />
                  </div>
                </div>
                {duration <= 0 && (
                  <div className="mt-4 flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">
                    <AlertCircle size={16} />
                    <p className="text-xs font-bold">
                      Return date must be after pick-up date.
                    </p>
                  </div>
                )}
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Duration
                    </p>
                    <p className="text-xl font-black text-slate-900">
                      {duration} Days
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Total Cost
                    </p>
                    <p className="text-xl font-black text-slate-900">
                      Rs.{totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-200 sticky top-8">
            <h3 className="text-xl font-black mb-8">Booking Summary</h3>

            <div className="space-y-8">
              {/* User Summary */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  Customer
                </p>
                {selectedUser ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-700">
                      <img
                        src={selectedUser.avatar}
                        alt={selectedUser.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{selectedUser.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-600 italic">
                    No user selected
                  </p>
                )}
              </div>

              {/* Vehicle Summary */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  Vehicle
                </p>
                {selectedVehicle ? (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-10 rounded-lg bg-slate-800 overflow-hidden border border-slate-700">
                      <img
                        src={selectedVehicle.image}
                        alt={selectedVehicle.model}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold">
                        {selectedVehicle.make} {selectedVehicle.model}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {selectedVehicle.licensePlate}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-600 italic">
                    No vehicle selected
                  </p>
                )}
              </div>

              {/* Driver Summary */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  Driver
                </p>
                {selectedDriver ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-700">
                      <img
                        src={selectedDriver.avatar}
                        alt={selectedDriver.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{selectedDriver.name}</p>
                      <p className="text-[10px] text-slate-400">
                        Rs.{selectedDriver.pricePerDay}/day
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-300 font-bold">Self Drive</p>
                )}
              </div>

              {/* Dates Summary */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  Rental Period
                </p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs font-bold">
                      {format(new Date(startDate), "MMM d")}
                    </p>
                    <p className="text-[10px] text-slate-400">Pick-up</p>
                  </div>
                  <ArrowRight size={14} className="text-slate-600" />
                  <div>
                    <p className="text-xs font-bold">
                      {format(new Date(endDate), "MMM d")}
                    </p>
                    <p className="text-[10px] text-slate-400">Return</p>
                  </div>
                </div>
              </div>

              {/* Add-ons Summary */}
              {selectedAddOns.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    Add-ons
                  </p>
                  <div className="space-y-2">
                    {selectedAddOns.map((addon) => (
                      <div
                        key={addon.id}
                        className="flex justify-between items-center"
                      >
                        <span className="text-xs text-slate-300">
                          {addon.name}
                        </span>
                        <span className="text-xs font-bold text-brand-400">
                          +Rs.{addon.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="h-px bg-slate-800" />

              {/* Total - Hidden as requested, will be shown in payments tab */}
              <div className="flex justify-between items-end opacity-0 pointer-events-none h-0">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    Total Amount
                  </p>
                  <p className="text-3xl font-black text-brand-400">
                    Rs.{totalAmount.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400">
                    {duration} days
                  </p>
                </div>
              </div>

              <button
                disabled={
                  step < 5 || duration <= 0 || !selectedUser || !selectedVehicle
                }
                onClick={handleConfirm}
                className={cn(
                  "w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2",
                  step === 5 && duration > 0
                    ? "bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-900/20"
                    : "bg-slate-800 text-slate-600 cursor-not-allowed",
                )}
              >
                Confirm Booking
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="w-full py-3 text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors"
            >
              Back to Step {step - 1}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewBooking;
