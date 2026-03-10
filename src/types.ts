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

export interface Booking {
  id: string;
  vehicleId: string;
  customerId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: 'Confirmed' | 'Completed' | 'Cancelled' | 'Pending';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  totalBookings: number;
  joinDate: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  customerId: string;
  amount: number;
  date: string;
  method: 'Credit Card' | 'PayPal' | 'Bank Transfer' | 'Cash';
  status: 'Paid' | 'Pending' | 'Refunded' | 'Failed';
}
