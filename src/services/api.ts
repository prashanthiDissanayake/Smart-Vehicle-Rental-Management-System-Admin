import { Vehicle, Booking, User, Payment } from '../types';

export const fetchVehicles = async (): Promise<Vehicle[]> => {
  const response = await fetch('/api/vehicles');
  return response.json();
};

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch('/api/users');
  return response.json();
};

export const fetchBookings = async (): Promise<(Booking & { make: string; model: string; customerName: string })[]> => {
  const response = await fetch('/api/bookings');
  return response.json();
};

export const fetchPayments = async (): Promise<(Payment & { customerName: string })[]> => {
  const response = await fetch('/api/payments');
  return response.json();
};

export const fetchStats = async () => {
  const response = await fetch('/api/stats');
  return response.json();
};

export const returnVehicle = async (bookingId: string, data: any) => {
  const response = await fetch(`/api/bookings/${bookingId}/return`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const createUser = async (data: any) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const updateUser = async (id: string, data: any) => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const deleteUser = async (id: string) => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};

export const createVehicle = async (data: any) => {
  const response = await fetch('/api/vehicles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const updateVehicle = async (id: string, data: any) => {
  const response = await fetch(`/api/vehicles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const deleteVehicle = async (id: string) => {
  const response = await fetch(`/api/vehicles/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};

export const createBooking = async (data: any) => {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const updateBooking = async (id: string, data: any) => {
  const response = await fetch(`/api/bookings/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const deleteBooking = async (id: string) => {
  const response = await fetch(`/api/bookings/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};
