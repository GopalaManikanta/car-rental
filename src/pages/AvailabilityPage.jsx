import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCars } from '../context/CarContext';
import { useBooking } from '../context/BookingContext';
import { useCustomers } from '../context/CustomerContext';
import Breadcrumbs from '../components/common/Breadcrumbs';
import QuickBookingModal from '../components/cars/QuickBookingModal';
import EmptyState from '../components/common/EmptyState';
import { toast } from 'react-toastify';
import {
  Car,
  CheckCircle2,
  Clock,
  Wrench,
  Search,
  Filter,
  Zap,
  Eye,
  Activity,
  ArrowRight,
  User,
  Calendar,
  RotateCcw,
  Check,
  Play
} from 'lucide-react';

const AvailabilityPage = () => {
  const navigate = useNavigate();
  const { cars, updateCar } = useCars();
  const { bookings } = useBooking();
  const { customers } = useCustomers();

  const [searchTerm, setSearchTerm] = useState('');
  const [fuelFilter, setFuelFilter] = useState('All');

  // Booking modal state
  const [selectedCarForBooking, setSelectedCarForBooking] = useState(null);

  // Quick Status Toggle Handler
  const handleStatusChange = (carId, newStatus) => {
    updateCar(carId, { availabilityStatus: newStatus });
    if (newStatus === 'Available') {
      toast.success('Vehicle returned to Ready Fleet Pool!');
    } else if (newStatus === 'Maintenance') {
      toast.warn('Vehicle moved to Servicing Bay.');
    } else {
      toast.info(`Vehicle status set to ${newStatus}.`);
    }
  };

  // Group vehicles into 3 operational columns
  const availablePool = useMemo(() => {
    return cars.filter(
      (c) =>
        c.availabilityStatus === 'Available' &&
        (fuelFilter === 'All' || c.fuelType.toLowerCase() === fuelFilter.toLowerCase()) &&
        (c.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.model.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [cars, searchTerm, fuelFilter]);

  const onRoadPool = useMemo(() => {
    return cars.filter(
      (c) =>
        (c.availabilityStatus === 'Booked' || c.availabilityStatus === 'Rented') &&
        (fuelFilter === 'All' || c.fuelType.toLowerCase() === fuelFilter.toLowerCase()) &&
        (c.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.model.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [cars, searchTerm, fuelFilter]);

  const maintenancePool = useMemo(() => {
    return cars.filter(
      (c) =>
        c.availabilityStatus === 'Maintenance' &&
        (fuelFilter === 'All' || c.fuelType.toLowerCase() === fuelFilter.toLowerCase()) &&
        (c.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.model.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [cars, searchTerm, fuelFilter]);

  // Overall metrics
  const totalFleet = cars.length;
  const readyCount = cars.filter((c) => c.availabilityStatus === 'Available').length;
  const onRoadCount = cars.filter(
    (c) => c.availabilityStatus === 'Booked' || c.availabilityStatus === 'Rented'
  ).length;
  const serviceCount = cars.filter((c) => c.availabilityStatus === 'Maintenance').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      <Breadcrumbs paths={[{ name: 'Fleet Dispatch Operations' }]} />

      {/* Control Room Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 w-fit mb-2">
            <Activity className="w-3.5 h-3.5 text-orange-400" /> Live Dispatch Board
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            Fleet Operational Readiness Control Room
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kanban status board for monitoring active rental deployments, servicing bay queues, and instant customer vehicle dispatch.
          </p>
        </div>

        {/* Top Summary Metrics */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Ready Fleet</span>
            <span className="text-lg font-black text-emerald-400">{readyCount} Vehicles</span>
          </div>

          <div className="bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">On Road</span>
            <span className="text-lg font-black text-blue-400">{onRoadCount} Leased</span>
          </div>

          <div className="bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Servicing</span>
            <span className="text-lg font-black text-rose-400">{serviceCount} Bay</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search vehicle brand, model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Powertrain Filter:</label>
          <select
            value={fuelFilter}
            onChange={(e) => setFuelFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="All">All Engine Types</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Petrol">Petrol</option>
          </select>
        </div>
      </div>

      {/* Kanban Dispatch Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* COLUMN 1: Ready Fleet Pool */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Ready Pool</h3>
                <p className="text-[11px] text-slate-400">Available for instant lease</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-black text-xs">
              {availablePool.length}
            </span>
          </div>

          <div className="space-y-4 max-h-[750px] overflow-y-auto pr-1 custom-scrollbar">
            {availablePool.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-medium">
                No vehicles currently available in Ready Pool.
              </div>
            ) : (
              availablePool.map((car) => (
                <div
                  key={car.id}
                  className="bg-slate-50/70 border border-slate-200 hover:border-emerald-400 rounded-2xl p-4 shadow-xs space-y-3 transition group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={car.image}
                      alt={car.model}
                      className="w-16 h-12 object-cover rounded-xl border border-slate-200 shrink-0"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-600 transition">
                        {car.brand} {car.model}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {car.fuelType} • {car.transmission} • ${car.pricePerDay}/day
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-xs">
                    <button
                      onClick={() => setSelectedCarForBooking(car)}
                      className="flex-1 py-2 px-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                    >
                      <Zap className="w-3.5 h-3.5" /> Dispatch / Book
                    </button>

                    <button
                      onClick={() => handleStatusChange(car.id, 'Maintenance')}
                      className="p-2 bg-slate-200/80 hover:bg-rose-100 text-slate-600 hover:text-rose-600 rounded-xl transition cursor-pointer"
                      title="Send to Service Bay"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 2: On Road (Active Leases) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-blue-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-200">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">On Road Leases</h3>
                <p className="text-[11px] text-slate-400">Currently deployed on customer rentals</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-black text-xs">
              {onRoadPool.length}
            </span>
          </div>

          <div className="space-y-4 max-h-[750px] overflow-y-auto pr-1 custom-scrollbar">
            {onRoadPool.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-medium">
                No vehicles currently deployed on road.
              </div>
            ) : (
              onRoadPool.map((car) => {
                const activeBooking = bookings.find(
                  (b) => b.carId === car.id && b.status === 'Active'
                );
                const assignedCustomer = activeBooking
                  ? customers.find((c) => c.id === activeBooking.customerId)
                  : null;

                return (
                  <div
                    key={car.id}
                    className="bg-slate-50/70 border border-slate-200 hover:border-blue-400 rounded-2xl p-4 shadow-xs space-y-3 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={car.image}
                        alt={car.model}
                        className="w-16 h-12 object-cover rounded-xl border border-slate-200 shrink-0"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-blue-600 transition">
                          {car.brand} {car.model}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">
                          ${car.pricePerDay}/day • {car.fuelType}
                        </p>
                      </div>
                    </div>

                    {/* Active Lease Badge details */}
                    <div className="bg-blue-50/80 border border-blue-200/80 p-2.5 rounded-xl space-y-1 text-xs">
                      <p className="font-bold text-blue-900 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-blue-600" />
                          {assignedCustomer?.name || 'Assigned Customer'}
                        </span>
                        <span className="text-[10px] text-blue-600 bg-white px-2 py-0.5 rounded-md font-mono">
                          {activeBooking?.returnDate ? `Returns ${activeBooking.returnDate}` : 'On Lease'}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60 text-xs">
                      <button
                        onClick={() => handleStatusChange(car.id, 'Available')}
                        className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-emerald-400" /> Return to Fleet Pool
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMN 3: Maintenance Bay */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-200">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Service Bay</h3>
                <p className="text-[11px] text-slate-400">Scheduled maintenance & repairs</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full font-black text-xs">
              {maintenancePool.length}
            </span>
          </div>

          <div className="space-y-4 max-h-[750px] overflow-y-auto pr-1 custom-scrollbar">
            {maintenancePool.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-medium">
                No vehicles currently under servicing.
              </div>
            ) : (
              maintenancePool.map((car) => (
                <div
                  key={car.id}
                  className="bg-slate-50/70 border border-slate-200 hover:border-rose-400 rounded-2xl p-4 shadow-xs space-y-3 transition group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={car.image}
                      alt={car.model}
                      className="w-16 h-12 object-cover rounded-xl border border-slate-200 shrink-0"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-rose-600 transition">
                        {car.brand} {car.model}
                      </h4>
                      <p className="text-[11px] text-rose-600 font-bold">
                        Under Servicing • ${car.pricePerDay}/day
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-xs">
                    <button
                      onClick={() => handleStatusChange(car.id, 'Available')}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                    >
                      <Check className="w-3.5 h-3.5" /> Mark Servicing Complete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Booking Modal */}
      {selectedCarForBooking && (
        <QuickBookingModal
          isOpen={Boolean(selectedCarForBooking)}
          onClose={() => setSelectedCarForBooking(null)}
          car={selectedCarForBooking}
        />
      )}
    </div>
  );
};

export default AvailabilityPage;
