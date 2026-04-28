import { Vehicle, Booking, User, Payment, AddOn, Driver, Inspection } from './types';

export const VEHICLES: Vehicle[] = [
  {
    id: '1',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    type: 'Electric',
    status: 'Available',
    pricePerDay: 120,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=400&q=80',
    licensePlate: 'EV-9921',
  },
  {
    id: '2',
    make: 'BMW',
    model: 'X5',
    year: 2022,
    type: 'SUV',
    status: 'Rented',
    pricePerDay: 150,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80',
    licensePlate: 'BMW-4402',
  },
  {
    id: '3',
    make: 'Ford',
    model: 'F-150',
    year: 2021,
    type: 'Truck',
    status: 'Maintenance',
    pricePerDay: 90,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=400&q=80',
    licensePlate: 'TRK-1120',
  },
  {
    id: '4',
    make: 'Mercedes',
    model: 'S-Class',
    year: 2023,
    type: 'Luxury',
    status: 'Available',
    pricePerDay: 250,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=400&q=80',
    licensePlate: 'LUX-7777',
  },
  {
    id: '5',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    type: 'Sedan',
    status: 'Available',
    pricePerDay: 65,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=400&q=80',
    licensePlate: 'SED-5521',
  },
];

export const USERS: User[] = [
  {
    id: 'u1',
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://i.pravatar.cc/150?u=u1',
    role: 'Admin',
    totalBookings: 12,
    joinDate: '2023-01-15',
    status: 'Active',
  },
  {
    id: 'u2',
    name: 'Sarah Miller',
    email: 'sarah.m@example.com',
    phone: '+1 (555) 987-6543',
    avatar: 'https://i.pravatar.cc/150?u=u2',
    role: 'Manager',
    totalBookings: 5,
    joinDate: '2023-05-20',
    status: 'Active',
  },
  {
    id: 'u3',
    name: 'Michael Chen',
    email: 'm.chen@example.com',
    phone: '+1 (555) 456-7890',
    avatar: 'https://i.pravatar.cc/150?u=u3',
    role: 'Staff',
    totalBookings: 8,
    joinDate: '2023-03-10',
    status: 'Active',
  },
  {
    id: 'u4',
    name: 'Emma Wilson',
    email: 'emma.w@example.com',
    phone: '+1 (555) 222-3333',
    avatar: 'https://i.pravatar.cc/150?u=u4',
    role: 'Customer',
    totalBookings: 2,
    joinDate: '2024-01-05',
    status: 'Active',
  },
];

export const ADD_ONS: AddOn[] = [
  {
    id: 'ao1',
    name: 'GPS Navigation',
    price: 15,
    description: 'Never get lost with our premium GPS navigation system.',
    icon: 'Navigation'
  },
  {
    id: 'ao2',
    name: 'Child Safety Seat',
    price: 25,
    description: 'Keep your little ones safe and comfortable during the ride.',
    icon: 'Baby'
  },
  {
    id: 'ao3',
    name: 'Premium Insurance',
    price: 45,
    description: 'Full coverage for peace of mind on the road.',
    icon: 'ShieldCheck'
  },
  {
    id: 'ao4',
    name: 'Extra Driver',
    price: 20,
    description: 'Share the driving duties with an additional authorized driver.',
    icon: 'Users'
  },
  {
    id: 'ao5',
    name: 'Wi-Fi Hotspot',
    price: 10,
    description: 'Stay connected with high-speed internet on the go.',
    icon: 'Wifi'
  }
];

export const BOOKINGS: Booking[] = [
  {
    id: 'b1',
    vehicleId: '2',
    userId: 'u1',
    startDate: '2024-03-01',
    endDate: '2024-03-05',
    totalAmount: 600,
    status: 'Completed',
    addOns: [ADD_ONS[0], ADD_ONS[2]]
  },
  {
    id: 'b2',
    vehicleId: '1',
    userId: 'u2',
    startDate: '2024-03-10',
    endDate: '2024-03-15',
    totalAmount: 600,
    status: 'Confirmed',
    addOns: [ADD_ONS[4]]
  },
  {
    id: 'b3',
    vehicleId: '4',
    userId: 'u3',
    startDate: '2024-03-08',
    endDate: '2024-03-12',
    totalAmount: 1000,
    status: 'Pending',
    addOns: [ADD_ONS[1], ADD_ONS[3]]
  },
];

export const PAYMENTS: Payment[] = [
  {
    id: 'p1',
    bookingId: 'b1',
    userId: 'u1',
    amount: 600,
    date: '2024-03-01',
    method: 'Credit Card',
    status: 'Paid',
  },
  {
    id: 'p2',
    bookingId: 'b2',
    userId: 'u2',
    amount: 600,
    date: '2024-03-10',
    method: 'PayPal',
    status: 'Paid',
  },
  {
    id: 'p3',
    bookingId: 'b3',
    userId: 'u3',
    amount: 1000,
    date: '2024-03-08',
    method: 'Bank Transfer',
    status: 'Pending',
  },
];

export const DRIVERS: Driver[] = [
  {
    id: 'd1',
    name: 'Kasun Perera',
    licenseNumber: 'DL-9921-001',
    phone: '+1 (555) 111-2222',
    avatar: 'https://i.pravatar.cc/150?u=d1',
    status: 'Available',
    rating: 4.8,
    experience: '10 Years',
    pricePerDay: 50
  },
  {
    id: 'd2',
    name: 'Amal Fernando',
    licenseNumber: 'DL-9921-002',
    phone: '+1 (555) 333-4444',
    avatar: 'https://i.pravatar.cc/150?u=d2',
    status: 'Available',
    rating: 4.9,
    experience: '15 Years',
    pricePerDay: 50
  },
  {
    id: 'd3',
    name: 'Nadun Karunarathna',
    licenseNumber: 'DL-9921-003',
    phone: '+1 (555) 555-6666',
    avatar: 'https://i.pravatar.cc/150?u=d3',
    status: 'On Trip',
    rating: 4.7,
    experience: '8 Years',
    pricePerDay: 50
  }
];

export const INSPECTIONS: Inspection[] = [
  {
    id: 'i1',
    bookingId: 'b1',
    vehicleId: '2',
    userId: 'u1',
    returnDate: '2024-03-05',
    mileage: 45200,
    fuelLevel: 95,
    conditionNotes: 'Vehicle returned in excellent condition. Minor dust on floor mats.',
    damages: [],
    totalCharges: 600,
    status: 'Completed'
  },
  {
    id: 'i2',
    bookingId: 'b2',
    vehicleId: '1',
    userId: 'u2',
    returnDate: '2024-03-15',
    mileage: 12500,
    fuelLevel: 80,
    conditionNotes: 'Small scratch on the rear bumper reported.',
    damages: [
      {
        part: 'Rear Bumper',
        description: 'Minor scratch during parking',
        severity: 'Minor',
        price: 150
      }
    ],
    totalCharges: 750,
    status: 'Completed'
  }
];
