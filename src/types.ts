export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  type: 'Sedan' | 'SUV' | 'Truck' | 'Luxury' | 'Electric';
  status: 'Available' | 'Rented' | 'Maintenance';
  pricePerDay: number;
  image: string;
  licensePlate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'Admin' | 'Manager' | 'Staff' | 'Customer';
  totalBookings?: number;
  joinDate: string;
  status: 'Active' | 'Inactive' | 'Suspended';
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: string;
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  avatar: string;
  status: 'Available' | 'On Trip' | 'Off Duty';
  rating: number;
  experience: string;
  pricePerDay: number;
}

export interface Booking {
  id: string;
  vehicleId: string;
  userId: string;
  driverId?: string;
  startDate: string;
  endDate: string;
  duration: number;
  vehiclePerDay: number;
  driverPerDay: number;
  addonsTotal:number;
  totalAmount: number;
  status: 'Confirmed' | 'Completed' | 'Cancelled' | 'Pending';
  addOns?: AddOn[];
}

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  ad_amount: number;
  date: string;
  method: 'Credit Card' | 'PayPal' | 'Bank Transfer' | 'Cash';
  status: 'Paid' | 'Pending' | 'Refunded' | 'Failed';
}

export interface Inspection {
  id: string;
  bookingId: string;
  vehicleId: string;
  userId: string;
  returnDate: string;
  mileage: number;
  fuelLevel: number;
  conditionNotes: string;
  damages: {
    part: string;
    description: string;
    severity: 'Minor' | 'Moderate' | 'Severe';
    price: number;
  }[];
  totalCharges: number;
  status: 'Completed' | 'Pending Review' | 'Flagged';
}
