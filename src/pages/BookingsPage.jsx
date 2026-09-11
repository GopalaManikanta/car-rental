import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useCars } from '../context/CarContext';
import { useCustomers } from '../context/CustomerContext';
import Breadcrumbs from '../components/common/Breadcrumbs';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Modal from '../components/common/Modal';
import {
  Plus,
  Search,
  Calendar,
  Ban,
  CheckCircle,
  Eye,
  FileText,
  DollarSign,
  TrendingUp,
  Car,
  User,
  ShieldCheck,
  Printer,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { toast } from 'react-toastify';

const BookingsPage = () => {
  const { bookings, cancelBooking, completeBooking } = useBooking();
  const { cars, getCarById, updateCar } = useCars();
  const { customers, getCustomerById } = useCustomers();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  // Selected Booking for Detailed Contract Modal
  const [selectedBookingModal, setSelectedBookingModal] = useState(null);

  // Custom Confirm Modal State
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    type: null,
    bookingId: null,
    carId: null
  });

  // Helper to reliably resolve Customer object (handles ID format variations)
  const resolveCustomer = (customerId) => {
    let cust = getCustomerById(customerId);
    if (cust) return cust;
    const idNum = parseInt(String(customerId).replace(/\D/g, ''), 10);
    if (!isNaN(idNum) && idNum > 0 && customers[idNum - 1]) {
      return customers[idNum - 1];
    }
    return customers[0] || {
      id: 'cust-1',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      mobile: '9876543210',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    };
  };

  // Helper to reliably resolve Car object (handles ID format variations)
  const resolveCar = (carId) => {
    let car = getCarById(carId);
    if (car) return car;
    const idNum = parseInt(String(carId).replace(/\D/g, ''), 10);
    if (!isNaN(idNum) && idNum >= 101 && cars[idNum - 101]) {
      return cars[idNum - 101];
    }
    return cars.find((c) => c.brand === 'Hyundai') || cars[0] || {
      id: 'car-108',
      brand: 'Hyundai',
      model: 'Ioniq 5',
      year: 2024,
      fuelType: 'Electric',
      pricePerDay: 85,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
    };
  };

  const openCancelModal = (bookingId, carId) => {
    setDialogState({ isOpen: true, type: 'cancel', bookingId, carId });
  };

  const openCompleteModal = (bookingId, carId) => {
    setDialogState({ isOpen: true, type: 'complete', bookingId, carId });
  };

  const handleConfirmAction = () => {
    const { type, bookingId, carId } = dialogState;
    if (type === 'cancel') {
      cancelBooking(bookingId);
      updateCar(carId, { availabilityStatus: 'Available' });
      toast.info('Reservation cancelled successfully.');
    } else if (type === 'complete') {
      completeBooking(bookingId);
      updateCar(carId, { availabilityStatus: 'Available' });
      toast.success('Reservation marked as completed!');
    }
    setDialogState({ isOpen: false, type: null, bookingId: null, carId: null });
  };

  // Metrics
  const totalCount = bookings.length;
  const activeCount = bookings.filter((b) => b.status === 'Active').length;
  const completedCount = bookings.filter((b) => b.status === 'Completed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'Cancelled').length;

  const totalContractRevenue = bookings
    .filter((b) => b.status !== 'Cancelled')
    .reduce((acc, curr) => acc + curr.totalCost, 0);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const customer = resolveCustomer(b.customerId);
      const car = resolveCar(b.carId);

      const custName = customer.name || `${customer.firstName || ''} ${customer.lastName || ''}`;
      const searchMatch =
        custName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.id.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch = statusFilter === 'All' || b.status === statusFilter;
      const dateMatch = !dateFilter || b.pickupDate === dateFilter || b.returnDate === dateFilter;

      return searchMatch && statusMatch && dateMatch;
    });
  }, [bookings, searchTerm, statusFilter, dateFilter, customers, cars]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn">
      <Breadcrumbs paths={[{ name: 'Booking History' }]} />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-md">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-7 h-7 text-orange-500" /> Executive Reservation Contracts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time management of active rentals, completed leases, and customer billing contracts.
          </p>
        </div>

        <Link
          to="/booking/new"
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-2xl shadow-md shadow-orange-500/30 transition text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Reservation</span>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">Total Revenue</span>
          <p className="text-2xl font-black text-slate-900 mt-2">${totalContractRevenue.toLocaleString()}</p>
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" /> Active Leases
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">Total Reservations</span>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalCount}</p>
          <span className="text-xs text-slate-500 font-medium mt-1 block">Lifetime Records</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">Active On Road</span>
          <p className="text-2xl font-black text-blue-600 mt-2">{activeCount}</p>
          <span className="text-xs text-blue-600 font-bold mt-1 block">Current Leases</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">Completed Contracts</span>
          <p className="text-2xl font-black text-emerald-600 mt-2">{completedCount}</p>
          <span className="text-xs text-emerald-600 font-bold mt-1 block">Successfully Returned</span>
        </div>
      </div>

      {/* Status Filter Tabs & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          {/* Status Pills */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar">
            {[
              { key: 'All', label: `All (${totalCount})` },
              { key: 'Active', label: `Active (${activeCount})` },
              { key: 'Completed', label: `Completed (${completedCount})` },
              { key: 'Cancelled', label: `Cancelled (${cancelledCount})` }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  statusFilter === tab.key
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search ID, Customer, Car..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Reservations Table */}
        {filteredBookings.length === 0 ? (
          <EmptyState title="No Reservations Found" message="Try adjusting your filters or search keywords." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="text-xs font-bold text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Contract ID</th>
                  <th className="px-4 py-3">Customer Profile</th>
                  <th className="px-4 py-3">Rented Vehicle</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Total Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((b) => {
                  const car = resolveCar(b.carId);
                  const customer = resolveCustomer(b.customerId);
                  const custName = customer.name || `${customer.firstName || ''} ${customer.lastName || ''}`;

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-4">
                        <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                          {b.id.split('-')[1] || b.id}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              customer.image ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(custName)}&background=f97316&color=fff`
                            }
                            alt={custName}
                            className="w-10 h-10 rounded-full object-cover border-2 border-orange-200 shadow-xs shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(custName)}&background=f97316&color=fff`;
                            }}
                          />
                          <div>
                            <p className="font-extrabold text-slate-900 text-sm">{custName}</p>
                            <p className="text-xs text-slate-400">{customer.email}</p>
                            {customer.mobile && (
                              <p className="text-[10px] text-slate-400 font-mono">+91 {customer.mobile}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={car.image}
                            alt={car.model}
                            className="w-12 h-10 object-cover rounded-xl shadow-xs border border-slate-200 shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                          <div>
                            <p className="font-extrabold text-slate-900 text-xs">{car.brand} {car.model}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{car.fuelType} • {car.year}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="text-xs font-semibold text-slate-800">{b.pickupDate} → {b.returnDate}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{b.totalDays} Rental Days</p>
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-black text-slate-900 text-sm">${b.totalCost}</span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            b.status === 'Active'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : b.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Invoice View Modal */}
                          <button
                            onClick={() => setSelectedBookingModal(b)}
                            className="p-2 bg-slate-100 hover:bg-orange-50 text-slate-600 hover:text-orange-600 rounded-xl transition cursor-pointer"
                            title="View Rental Invoice"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {b.status === 'Active' && (
                            <>
                              <button
                                onClick={() => openCompleteModal(b.id, b.carId)}
                                className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition cursor-pointer"
                                title="Mark Completed"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => openCancelModal(b.id, b.carId)}
                                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition cursor-pointer"
                                title="Cancel Reservation"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Contract Receipt Modal */}
      {selectedBookingModal && (
        <Modal
          isOpen={Boolean(selectedBookingModal)}
          onClose={() => setSelectedBookingModal(null)}
          title={`Contract Invoice #${selectedBookingModal.id}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-5 text-sm p-1">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">VELOCITY CAR RENTALS</h4>
                <p className="text-xs text-slate-500">Official Rental Lease Invoice</p>
              </div>
              <span className="px-3 py-1 bg-orange-50 border border-orange-200 text-orange-700 font-bold text-xs rounded-full uppercase">
                {selectedBookingModal.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-3">
                <img
                  src={
                    resolveCustomer(selectedBookingModal.customerId).image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(resolveCustomer(selectedBookingModal.customerId).name)}&background=f97316&color=fff`
                  }
                  alt="Customer Avatar"
                  className="w-10 h-10 rounded-full object-cover border border-orange-200 shrink-0"
                />
                <div>
                  <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400 mb-0.5">Customer</p>
                  <p className="font-bold text-slate-800">{resolveCustomer(selectedBookingModal.customerId).name}</p>
                  <p className="text-slate-500 text-[11px]">{resolveCustomer(selectedBookingModal.customerId).email}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-3">
                <img
                  src={resolveCar(selectedBookingModal.carId).image}
                  alt="Car Thumbnail"
                  className="w-12 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                />
                <div>
                  <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400 mb-0.5">Vehicle</p>
                  <p className="font-bold text-slate-800">
                    {resolveCar(selectedBookingModal.carId).brand} {resolveCar(selectedBookingModal.carId).model}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    ${resolveCar(selectedBookingModal.carId).pricePerDay} / day
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50/60 p-4 rounded-xl space-y-2 text-xs border border-orange-100">
              <div className="flex justify-between">
                <span className="text-slate-600">Pickup Date:</span>
                <span className="font-bold text-slate-800">{selectedBookingModal.pickupDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Return Date:</span>
                <span className="font-bold text-slate-800">{selectedBookingModal.returnDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Rental Duration:</span>
                <span className="font-bold text-slate-800">{selectedBookingModal.totalDays} Days</span>
              </div>
              <div className="flex justify-between border-t border-orange-200/60 pt-2 text-sm font-black text-slate-900">
                <span>Total Amount Paid:</span>
                <span className="text-orange-600 text-lg">${selectedBookingModal.totalCost}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Contract
              </button>
              <button
                onClick={() => setSelectedBookingModal(null)}
                className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs shadow transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, type: null, bookingId: null, carId: null })}
        onConfirm={handleConfirmAction}
        title={dialogState.type === 'cancel' ? 'Cancel Reservation' : 'Complete Reservation'}
        message={
          dialogState.type === 'cancel'
            ? 'Are you sure you want to cancel this booking reservation? The vehicle will be returned to the available fleet.'
            : 'Are you sure you want to mark this rental contract as completed? The vehicle will be returned to the available fleet.'
        }
        confirmText={dialogState.type === 'cancel' ? 'Cancel Booking' : 'Complete Booking'}
      />
    </div>
  );
};

export default BookingsPage;
