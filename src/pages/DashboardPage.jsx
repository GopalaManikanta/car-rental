import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCars } from '../context/CarContext';
import { useCustomers } from '../context/CustomerContext';
import {
  Car,
  CheckCircle2,
  Clock,
  Users,
  Key,
  DollarSign,
  TrendingUp,
  Plus,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { cars } = useCars();
  const { customers } = useCustomers();

  // Metrics Calculation
  const totalCars = cars.length;
  const availableCars = cars.filter((c) => c.availabilityStatus === 'Available').length;
  const bookedCars = cars.filter((c) => c.availabilityStatus === 'Booked').length;
  const maintenanceCars = cars.filter((c) => c.availabilityStatus === 'Maintenance').length;

  const totalCustomersCount = customers.length;
  const activeRentalsCount = bookedCars;

  // Revenue calculation based on booked cars price per day + dummy historical base
  const dailyRevenue = cars
    .filter((c) => c.availabilityStatus === 'Booked')
    .reduce((acc, curr) => acc + curr.pricePerDay, 0);
  const totalRevenue = 45280 + dailyRevenue * 30; // $45.2k base + active rental projection

  const recentBookings = [
    {
      id: 'BK-9921',
      customer: 'Rahul Sharma',
      car: 'BMW M4 Competition',
      duration: '3 Days',
      amount: '$450',
      status: 'Active',
      date: 'Today, 10:30 AM'
    },
    {
      id: 'BK-9920',
      customer: 'Priya Patel',
      car: 'Tesla Model S Plaid',
      duration: '5 Days',
      amount: '$900',
      status: 'Active',
      date: 'Yesterday'
    },
    {
      id: 'BK-9919',
      customer: 'Alexander Wright',
      car: 'Ford Mustang GT',
      duration: '2 Days',
      amount: '$220',
      status: 'Completed',
      date: '08 Sep 2026'
    },
    {
      id: 'BK-9918',
      customer: 'Sneha Reddy',
      car: 'Porsche 911 Carrera S',
      duration: '1 Day',
      amount: '$220',
      status: 'Active',
      date: '07 Sep 2026'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Cars */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-orange-300 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Cars</span>
            <div className="p-2.5 bg-orange-50 border border-orange-200 rounded-xl text-orange-600">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{totalCars}</span>
            <span className="text-xs text-slate-500 font-medium">Fleet Units</span>
          </div>
        </div>

        {/* Available Cars */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-orange-300 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available</span>
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-emerald-600">{availableCars}</span>
            <span className="text-xs text-emerald-600 font-medium">Ready to Rent</span>
          </div>
        </div>

        {/* Booked Cars */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-orange-300 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Booked</span>
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-amber-600">{bookedCars}</span>
            <span className="text-xs text-amber-600 font-medium">On Road</span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-orange-300 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Customers</span>
            <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-xl text-purple-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{totalCustomersCount}</span>
            <span className="text-xs text-slate-500 font-medium">Registered</span>
          </div>
        </div>

        {/* Active Rentals */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-orange-300 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Rentals</span>
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-600">
              <Key className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-blue-600">{activeRentalsCount}</span>
            <span className="text-xs text-blue-600 font-medium">Contracts</span>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="p-5 bg-gradient-to-br from-orange-600 to-amber-700 border border-orange-500 rounded-2xl shadow-md text-white hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-orange-100 uppercase tracking-wider">Est. Revenue</span>
            <div className="p-2.5 bg-white/20 border border-white/30 rounded-xl text-white">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-white">${totalRevenue.toLocaleString()}</span>
            <span className="text-[11px] text-white flex items-center font-bold">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14%
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Management Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/cars?action=add')}
            className="p-5 bg-white border border-slate-200 hover:border-orange-400 hover:bg-orange-50/40 rounded-2xl text-left transition group shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 mb-3 group-hover:scale-110 transition">
              <Plus className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 group-hover:text-orange-600 transition">Add New Car</h4>
            <p className="text-xs text-slate-500 mt-1">Insert a new vehicle specs & pricing into fleet</p>
          </button>

          <button
            onClick={() => navigate('/customers?action=add')}
            className="p-5 bg-white border border-slate-200 hover:border-orange-400 hover:bg-orange-50/40 rounded-2xl text-left transition group shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3 group-hover:scale-110 transition">
              <UserPlus className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 group-hover:text-orange-600 transition">Add Customer</h4>
            <p className="text-xs text-slate-500 mt-1">Register new client details and license verification</p>
          </button>

          <button
            onClick={() => navigate('/cars')}
            className="p-5 bg-white border border-slate-200 hover:border-orange-400 hover:bg-orange-50/40 rounded-2xl text-left transition group shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-110 transition">
              <Car className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 group-hover:text-orange-600 transition">Browse Fleet</h4>
            <p className="text-xs text-slate-500 mt-1">Filter, sort, and edit existing car inventory</p>
          </button>

          <button
            onClick={() => navigate('/customers')}
            className="p-5 bg-white border border-slate-200 hover:border-orange-400 hover:bg-orange-50/40 rounded-2xl text-left transition group shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mb-3 group-hover:scale-110 transition">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 group-hover:text-orange-600 transition">View Customers</h4>
            <p className="text-xs text-slate-500 mt-1">Manage active user accounts & rental history</p>
          </button>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Rentals & Contracts</h3>
            <p className="text-xs text-slate-500 mt-0.5">Live activity feed of customer vehicle rentals</p>
          </div>
          <button
            onClick={() => navigate('/cars')}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition"
          >
            View All Fleet <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="text-xs font-semibold text-slate-600 uppercase bg-orange-50/60 border-b border-orange-100">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Booking ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Car Rented</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Total Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-xl text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-orange-50/40 transition">
                  <td className="px-4 py-3.5 font-mono text-xs font-semibold text-orange-600">{b.id}</td>
                  <td className="px-4 py-3.5 font-medium text-slate-900">{b.customer}</td>
                  <td className="px-4 py-3.5 text-slate-700">{b.car}</td>
                  <td className="px-4 py-3.5 text-slate-500">{b.duration}</td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">{b.amount}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        b.status === 'Active'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right text-xs text-slate-500">{b.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
