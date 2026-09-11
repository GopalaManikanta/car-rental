import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useBooking } from '../../context/BookingContext';
import { useCars } from '../../context/CarContext';
import { useCustomers } from '../../context/CustomerContext';
import { toast } from 'react-toastify';
import {
  Car,
  Calendar,
  User,
  ShieldCheck,
  CheckCircle,
  CreditCard,
  DollarSign,
  Sparkles
} from 'lucide-react';

const QuickBookingModal = ({ isOpen, onClose, car }) => {
  const { addBooking } = useBooking();
  const { updateCar } = useCars();
  const { customers } = useCustomers();

  const [customerId, setCustomerId] = useState('');
  const [pickupDate, setPickupDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });

  const [addInsurance, setAddInsurance] = useState(true);
  const [totalDays, setTotalDays] = useState(3);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (pickupDate && returnDate && car) {
      const start = new Date(pickupDate);
      const end = new Date(returnDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (diffDays > 0 && end >= start) {
        setTotalDays(diffDays);
        const base = diffDays * car.pricePerDay;
        const extra = addInsurance ? 15 * diffDays : 0;
        setTotalCost(base + extra);
      } else {
        setTotalDays(0);
        setTotalCost(0);
      }
    }
  }, [pickupDate, returnDate, car, addInsurance]);

  if (!car) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerId) {
      toast.error('Please select a customer for this reservation.');
      return;
    }

    if (totalDays <= 0) {
      toast.error('Invalid date range. Return date must be after pickup date.');
      return;
    }

    // Create booking record
    addBooking({
      customerId,
      carId: car.id,
      pickupDate,
      returnDate,
      totalDays,
      totalCost,
      status: 'Active'
    });

    // Update car status to Rented in real-time Context API
    updateCar(car.id, { availabilityStatus: 'Rented' });

    const selectedCustomer = customers.find((c) => c.id === customerId);
    const custName = selectedCustomer?.name || `${selectedCustomer?.firstName || ''} ${selectedCustomer?.lastName || ''}`;

    toast.success(`🎉 Reserved ${car.brand} ${car.model} for ${custName || 'Customer'}!`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Instant Reservation: ${car.brand} ${car.model}`} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-5 animate-fadeIn">
        {/* Car Highlight Banner */}
        <div className="flex items-center gap-4 p-3.5 bg-orange-50/80 border border-orange-200 rounded-2xl">
          <img
            src={car.image}
            alt={car.model}
            className="w-20 h-20 object-cover rounded-xl shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-orange-500 text-white font-bold text-[10px] rounded-full uppercase">
                {car.fuelType}
              </span>
              <span className="text-xs font-semibold text-slate-500">{car.year} Model</span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-base mt-0.5">{car.brand} {car.model}</h4>
            <p className="text-xs text-orange-600 font-bold mt-0.5">${car.pricePerDay} USD / day</p>
          </div>
        </div>

        {/* Customer Select */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Select Customer
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              required
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-orange-500"
            >
              <option value="">-- Choose Customer --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name || `${c.firstName || ''} ${c.lastName || ''}`} ({c.email || c.mobile})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Inputs Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Pickup Date
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Return Date
            </label>
            <input
              type="date"
              required
              min={pickupDate || new Date().toISOString().split('T')[0]}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Insurance Option */}
        <div
          onClick={() => setAddInsurance(!addInsurance)}
          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition text-xs ${
            addInsurance ? 'bg-orange-50/80 border-orange-300' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-orange-500" />
            <div>
              <p className="font-bold text-slate-900">Comprehensive Loss & Damage Waiver</p>
              <p className="text-[10px] text-slate-500">Zero deductible insurance protection</p>
            </div>
          </div>
          <span className="font-bold text-orange-600">+$15/day</span>
        </div>

        {/* Instant Total Calculator */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
          <div className="flex justify-between text-xs text-slate-300">
            <span>Duration:</span>
            <span className="font-bold text-white">{totalDays} Days</span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-400">Total Invoice Amount:</span>
            <span className="text-xl font-black text-orange-400">${totalCost}</span>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={totalDays <= 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-500/30 transition"
          >
            <CheckCircle className="w-4 h-4" /> Confirm Instant Booking
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default QuickBookingModal;
