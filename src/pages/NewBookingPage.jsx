import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useCars } from '../context/CarContext';
import { useCustomers } from '../context/CustomerContext';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { toast } from 'react-toastify';
import {
  Calendar,
  Car,
  User,
  ShieldCheck,
  Navigation,
  Baby,
  CheckCircle,
  Clock,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CreditCard
} from 'lucide-react';

const NewBookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addBooking } = useBooking();
  const { cars, updateCar } = useCars();
  const { customers } = useCustomers();

  const initialCarId = location.state?.carId || '';

  const [step, setStep] = useState(1);
  const [customerId, setCustomerId] = useState('');
  const [carId, setCarId] = useState(initialCarId);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  // Addons
  const [addInsurance, setAddInsurance] = useState(true);
  const [addGPS, setAddGPS] = useState(false);
  const [addChildSeat, setAddChildSeat] = useState(false);

  const [totalDays, setTotalDays] = useState(0);
  const [baseCost, setBaseCost] = useState(0);
  const [addonCost, setAddonCost] = useState(0);

  const availableCars = cars.filter((c) => c.availabilityStatus === 'Available' || c.id === carId);
  const selectedCar = cars.find((c) => c.id === carId);
  const selectedCustomer = customers.find((c) => c.id === customerId);

  useEffect(() => {
    if (pickupDate && returnDate && selectedCar) {
      const start = new Date(pickupDate);
      const end = new Date(returnDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (diffDays > 0 && end >= start) {
        setTotalDays(diffDays);
        const base = diffDays * selectedCar.pricePerDay;
        setBaseCost(base);

        let addon = 0;
        if (addInsurance) addon += 15 * diffDays;
        if (addGPS) addon += 5 * diffDays;
        if (addChildSeat) addon += 10 * diffDays;
        setAddonCost(addon);
      } else {
        setTotalDays(0);
        setBaseCost(0);
        setAddonCost(0);
      }
    } else {
      setTotalDays(0);
      setBaseCost(0);
      setAddonCost(0);
    }
  }, [pickupDate, returnDate, selectedCar, addInsurance, addGPS, addChildSeat]);

  const totalCost = baseCost + addonCost;

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!customerId || !carId || !pickupDate || !returnDate) {
      toast.error('Please complete all required fields.');
      return;
    }

    if (selectedCar.availabilityStatus !== 'Available') {
      toast.error('Selected car is no longer available.');
      return;
    }

    const bookingData = {
      customerId,
      carId,
      pickupDate,
      returnDate,
      totalDays,
      totalCost,
      status: 'Active'
    };

    addBooking(bookingData);
    updateCar(carId, { availabilityStatus: 'Rented' });
    toast.success('🎉 Booking confirmed successfully! Invoice generated.');
    navigate('/bookings');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      <Breadcrumbs paths={[{ name: 'Bookings', link: '/bookings' }, { name: 'New Rental Reservation' }]} />

      {/* Stepper Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-orange-500 fill-orange-500" /> Executive Rental Booking Wizard
            </h1>
            <p className="text-xs text-slate-500 mt-1">Configure rental vehicle, driver details, and protection packages.</p>
          </div>
          <div className="text-right">
            <span className="text-xs uppercase font-bold text-orange-600 tracking-wider">Step {step} of 2</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition ${
              step === 1 ? 'bg-orange-500 text-white border-orange-500 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-sm">1</div>
            <div>
              <p className="text-xs font-bold">Customer & Vehicle</p>
              <p className="text-[10px] opacity-80">Select customer and car</p>
            </div>
          </button>

          <button
            onClick={() => {
              if (customerId && carId) setStep(2);
              else toast.info('Please select customer & car first.');
            }}
            className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition ${
              step === 2 ? 'bg-orange-500 text-white border-orange-500 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-sm">2</div>
            <div>
              <p className="text-xs font-bold">Dates & Extras</p>
              <p className="text-[10px] opacity-80">Protection & Total Invoice</p>
            </div>
          </button>
        </div>
      </div>

      <form onSubmit={handleConfirm} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Selection Area */}
        <div className="lg:col-span-7 space-y-6">
          {step === 1 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-500" /> Step 1: Customer Profile & Vehicle Selection
              </h3>

              {/* Customer Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Select Registered Customer
                </label>
                <select
                  required
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:border-orange-500 text-sm"
                >
                  <option value="">-- Select Customer --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name || `${c.firstName || ''} ${c.lastName || ''}`} ({c.mobile || c.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Car Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Select Fleet Vehicle
                </label>
                <select
                  required
                  value={carId}
                  onChange={(e) => setCarId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:border-orange-500 text-sm"
                >
                  <option value="">-- Choose Available Car --</option>
                  {availableCars.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.brand} {c.model} ({c.year}) - ${c.pricePerDay}/day
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Car Visual Preview Card */}
              {selectedCar && (
                <div className="p-4 bg-orange-50/60 border border-orange-200 rounded-2xl flex items-center gap-4 animate-fadeIn">
                  <img
                    src={selectedCar.image}
                    alt={selectedCar.model}
                    className="w-24 h-24 object-cover rounded-xl shadow-sm"
                  />
                  <div>
                    <span className="px-2.5 py-0.5 bg-orange-500 text-white font-bold text-[10px] rounded-full uppercase">
                      {selectedCar.fuelType}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1">
                      {selectedCar.brand} {selectedCar.model}
                    </h4>
                    <p className="text-xs text-slate-500">{selectedCar.transmission} • {selectedCar.seatingCapacity} Seats</p>
                    <p className="text-sm font-extrabold text-orange-600 mt-1">${selectedCar.pricePerDay} / day</p>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!customerId || !carId}
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-md transition text-sm"
                >
                  Next: Dates & Extras <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" /> Step 2: Schedule & Rental Add-ons
              </h3>

              {/* Date Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:border-orange-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Return Date
                  </label>
                  <input
                    type="date"
                    required
                    min={pickupDate || new Date().toISOString().split('T')[0]}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:border-orange-500 text-sm"
                  />
                </div>
              </div>

              {/* Protection & Extras */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select Protection & Extras
                </label>

                <div
                  onClick={() => setAddInsurance(!addInsurance)}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                    addInsurance ? 'bg-orange-50/80 border-orange-300' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-orange-500" />
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">Comprehensive Loss & Damage Waiver</h5>
                      <p className="text-xs text-slate-500">Zero deductible collision and liability coverage</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-orange-600">+$15 / day</span>
                </div>

                <div
                  onClick={() => setAddGPS(!addGPS)}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                    addGPS ? 'bg-orange-50/80 border-orange-300' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Navigation className="w-6 h-6 text-amber-500" />
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">Satellite GPS Navigation System</h5>
                      <p className="text-xs text-slate-500">Real-time traffic updates and offline maps</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-orange-600">+$5 / day</span>
                </div>

                <div
                  onClick={() => setAddChildSeat(!addChildSeat)}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                    addChildSeat ? 'bg-orange-50/80 border-orange-300' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Baby className="w-6 h-6 text-emerald-500" />
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">ISOFIX Child Safety Seat</h5>
                      <p className="text-xs text-slate-500">Certified infant & toddler protection seat</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-orange-600">+$10 / day</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Step 1
                </button>

                <button
                  type="submit"
                  disabled={totalDays <= 0}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-md transition text-sm"
                >
                  <CheckCircle className="w-4 h-4" /> Confirm & Issue Contract
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Invoice Summary Panel */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md sticky top-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-5 h-5 text-orange-500" /> Rental Invoice Summary
            </h3>

            {selectedCar ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center font-bold text-orange-600">
                    <Car className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{selectedCar.brand} {selectedCar.model}</h4>
                    <p className="text-xs text-slate-500">${selectedCar.pricePerDay} per day rate</p>
                  </div>
                </div>

                {selectedCustomer && (
                  <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl space-y-1">
                    <p className="font-bold text-slate-900">Customer: {selectedCustomer.name || selectedCustomer.firstName}</p>
                    <p className="text-slate-500">{selectedCustomer.email}</p>
                  </div>
                )}

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Duration:</span>
                    <span className="font-bold text-slate-800">{totalDays} Days</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Vehicle Base Cost:</span>
                    <span className="font-bold text-slate-800">${baseCost}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Protection & Add-ons:</span>
                    <span className="font-bold text-slate-800">${addonCost}</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-3 text-base font-black text-slate-900">
                    <span>Total Amount:</span>
                    <span className="text-2xl font-black text-orange-600">${totalCost}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Select a car & driver to calculate real-time invoice.
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewBookingPage;
