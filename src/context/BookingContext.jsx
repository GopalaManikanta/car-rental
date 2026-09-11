import React, { createContext, useContext, useState, useEffect } from 'react';

const BookingContext = createContext(null);

const INITIAL_BOOKINGS = [
  {
    id: 'B-9921-101',
    customerId: 'cust-1',
    carId: 'car-102',
    pickupDate: '2026-09-08',
    returnDate: '2026-09-12',
    totalDays: 4,
    totalCost: 600,
    status: 'Active',
    createdAt: '2026-09-08T10:30:00.000Z'
  },
  {
    id: 'B-9920-102',
    customerId: 'cust-2',
    carId: 'car-107',
    pickupDate: '2026-09-05',
    returnDate: '2026-09-10',
    totalDays: 5,
    totalCost: 550,
    status: 'Active',
    createdAt: '2026-09-05T14:15:00.000Z'
  },
  {
    id: 'B-9919-103',
    customerId: 'cust-3',
    carId: 'car-101',
    pickupDate: '2026-09-01',
    returnDate: '2026-09-04',
    totalDays: 3,
    totalCost: 540,
    status: 'Completed',
    createdAt: '2026-09-01T09:00:00.000Z'
  },
  {
    id: 'B-9914-108',
    customerId: 'cust-8',
    carId: 'car-108',
    pickupDate: '2026-09-09',
    returnDate: '2026-09-14',
    totalDays: 5,
    totalCost: 850,
    status: 'Active',
    createdAt: '2026-09-09T16:20:00.000Z'
  },
  {
    id: 'B-9918-104',
    customerId: 'cust-4',
    carId: 'car-103',
    pickupDate: '2026-08-25',
    returnDate: '2026-08-28',
    totalDays: 3,
    totalCost: 750,
    status: 'Completed',
    createdAt: '2026-08-25T11:20:00.000Z'
  },
  {
    id: 'B-9917-105',
    customerId: 'cust-5',
    carId: 'car-105',
    pickupDate: '2026-08-20',
    returnDate: '2026-08-22',
    totalDays: 2,
    totalCost: 440,
    status: 'Cancelled',
    createdAt: '2026-08-19T16:45:00.000Z'
  },
  {
    id: 'B-9916-106',
    customerId: 'cust-6',
    carId: 'car-104',
    pickupDate: '2026-08-12',
    returnDate: '2026-08-17',
    totalDays: 5,
    totalCost: 975,
    status: 'Completed',
    createdAt: '2026-08-12T08:10:00.000Z'
  },
  {
    id: 'B-9915-107',
    customerId: 'cust-7',
    carId: 'car-106',
    pickupDate: '2026-08-01',
    returnDate: '2026-08-07',
    totalDays: 6,
    totalCost: 390,
    status: 'Completed',
    createdAt: '2026-08-01T13:00:00.000Z'
  },
  {
    id: 'B-9912-109',
    customerId: 'cust-9',
    carId: 'car-102',
    pickupDate: '2026-07-15',
    returnDate: '2026-07-22',
    totalDays: 7,
    totalCost: 1050,
    status: 'Completed',
    createdAt: '2026-07-15T10:00:00.000Z'
  },
  {
    id: 'B-9911-110',
    customerId: 'cust-10',
    carId: 'car-101',
    pickupDate: '2026-07-04',
    returnDate: '2026-07-08',
    totalDays: 4,
    totalCost: 720,
    status: 'Completed',
    createdAt: '2026-07-04T14:30:00.000Z'
  },
  {
    id: 'B-9910-111',
    customerId: 'cust-1',
    carId: 'car-104',
    pickupDate: '2026-06-20',
    returnDate: '2026-06-25',
    totalDays: 5,
    totalCost: 975,
    status: 'Completed',
    createdAt: '2026-06-20T09:15:00.000Z'
  },
  {
    id: 'B-9909-112',
    customerId: 'cust-2',
    carId: 'car-108',
    pickupDate: '2026-05-10',
    returnDate: '2026-05-16',
    totalDays: 6,
    totalCost: 1020,
    status: 'Completed',
    createdAt: '2026-05-10T11:00:00.000Z'
  },
  {
    id: 'B-9908-114',
    customerId: 'cust-4',
    carId: 'car-108',
    pickupDate: '2026-09-02',
    returnDate: '2026-09-07',
    totalDays: 5,
    totalCost: 1100,
    status: 'Completed',
    createdAt: '2026-09-02T10:00:00.000Z'
  },
  {
    id: 'B-9913-113',
    customerId: 'cust-6',
    carId: 'car-108',
    pickupDate: '2026-08-15',
    returnDate: '2026-08-20',
    totalDays: 5,
    totalCost: 925,
    status: 'Completed',
    createdAt: '2026-08-15T14:00:00.000Z'
  }
];

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('car_rental_bookings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_BOOKINGS.length) {
          return parsed;
        }
      } catch (err) {
        console.error('Failed to parse stored bookings:', err);
      }
    }
    return INITIAL_BOOKINGS;
  });

  useEffect(() => {
    localStorage.setItem('car_rental_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (bookingData) => {
    const newBooking = {
      ...bookingData,
      id: `B-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = (bookingId, status) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  const cancelBooking = (bookingId) => updateBookingStatus(bookingId, 'Cancelled');
  const completeBooking = (bookingId) => updateBookingStatus(bookingId, 'Completed');

  const getBookingById = (bookingId) => bookings.find((b) => b.id === bookingId);

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        updateBookingStatus,
        cancelBooking,
        completeBooking,
        getBookingById
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
