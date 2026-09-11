import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCars } from '../context/CarContext';
import { useCustomers } from '../context/CustomerContext';
import { useBooking } from '../context/BookingContext';
import {
  Car,
  CheckCircle2,
  Clock,
  Users,
  Key,
  DollarSign,
  TrendingUp,
  Plus,
  ArrowRight,
  ClipboardList,
  Shield,
  Zap,
  Activity,
  BarChart3,
  Calendar,
  Sparkles,
  Wrench
} from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { cars, getCarById } = useCars();
  const { customers, getCustomerById } = useCustomers();
  const { bookings } = useBooking();

  const [chartMode, setChartMode] = useState('Monthly');

  // Metrics Calculation
  const totalCars = cars.length;
  const availableCars = cars.filter((c) => c.availabilityStatus === 'Available').length;
  const rentedCars = cars.filter((c) => c.availabilityStatus === 'Rented' || c.availabilityStatus === 'Booked').length;
  const maintenanceCars = cars.filter((c) => c.availabilityStatus === 'Maintenance').length;

  const totalCustomersCount = customers.length;
  const activeRentalsCount = bookings.filter((b) => b.status === 'Active').length;
  const totalBookingsCount = bookings.length;

  // Real-time Revenue Calculation
  const totalRevenue = bookings
    .filter((b) => b.status !== 'Cancelled')
    .reduce((acc, curr) => acc + curr.totalCost, 0);

  // Most Rented Car
  const carRentalCounts = bookings.reduce((acc, b) => {
    acc[b.carId] = (acc[b.carId] || 0) + 1;
    return acc;
  }, {});

  const mostRentedCarId = Object.keys(carRentalCounts).sort((a, b) => carRentalCounts[b] - carRentalCounts[a])[0];
  const mostRentedCar = mostRentedCarId ? getCarById(mostRentedCarId) : null;

  // Revenue by Month (Dynamic + Seeded Baseline)
  const monthlyData = useMemo(() => {
    const months = [
      { month: 'Jan', revenue: 4200, bookings: 5 },
      { month: 'Feb', revenue: 3800, bookings: 4 },
      { month: 'Mar', revenue: 5600, bookings: 7 },
      { month: 'Apr', revenue: 6900, bookings: 8 },
      { month: 'May', revenue: 6100, bookings: 6 },
      { month: 'Jun', revenue: 8400, bookings: 10 },
      { month: 'Jul', revenue: 7800, bookings: 9 },
      { month: 'Aug', revenue: 9200, bookings: 11 },
      { month: 'Sep', revenue: Math.max(9500, totalRevenue), bookings: Math.max(12, totalBookingsCount) }
    ];
    return months;
  }, [totalRevenue, totalBookingsCount]);

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Real-time System Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-orange-500/10 blur-3xl pointer-events-none"></div>

        <div className="z-10">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Live Fleet Engine Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
            Velocity Executive Operations Center
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Real-time rental tracking, fleet health monitoring, and automated revenue intelligence.
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center gap-3 z-10">
          <button
            onClick={() => navigate('/booking/new')}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 transition text-sm"
          >
            <Plus className="w-4 h-4" /> Create Reservation
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Net Revenue</span>
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-2xl text-orange-600 group-hover:scale-110 transition">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl sm:text-4xl font-black text-slate-900">${totalRevenue.toLocaleString()}</span>
            <div className="flex items-center gap-1 mt-2 text-xs font-bold text-emerald-600">
              <TrendingUp className="w-4 h-4" /> +16.8% vs last month
            </div>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Reservations</span>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-blue-600 group-hover:scale-110 transition">
              <ClipboardList className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl sm:text-4xl font-black text-slate-900">{totalBookingsCount}</span>
            <p className="text-xs text-slate-500 font-medium mt-2">
              <span className="font-bold text-blue-600">{activeRentalsCount} Active</span> contracts currently on road
            </p>
          </div>
        </div>

        {/* Fleet Health */}
        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Fleet</span>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-600 group-hover:scale-110 transition">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl sm:text-4xl font-black text-emerald-600">{availableCars}</span>
            <p className="text-xs text-slate-500 font-medium mt-2">
              Out of <span className="font-bold text-slate-800">{totalCars} Total Vehicles</span> in fleet
            </p>
          </div>
        </div>

        {/* Active Customers */}
        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Registered Customers</span>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl text-purple-600 group-hover:scale-110 transition">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl sm:text-4xl font-black text-slate-900">{totalCustomersCount}</span>
            <p className="text-xs text-slate-500 font-medium mt-2">Verified customer profiles</p>
          </div>
        </div>
      </div>

      {/* Main Analytics & Highlight Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Real-time Revenue Overview Chart */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-500" /> Revenue & Rental Performance Overview
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Monthly gross revenue comparison and growth tracking</p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setChartMode('Monthly')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  chartMode === 'Monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setChartMode('Weekly')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  chartMode === 'Weekly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                Weekly
              </button>
            </div>
          </div>

          {/* Interactive Bar Chart Visual */}
          <div className="flex items-end h-72 gap-3 pt-6 pb-2 border-b border-slate-100">
            {monthlyData.map((d, i) => {
              const heightPercent = Math.round((d.revenue / maxRevenue) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="relative w-full flex-1 flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-orange-400 to-amber-500 group-hover:from-orange-600 group-hover:to-amber-600 rounded-t-xl transition-all duration-300 relative shadow-sm"
                      style={{ height: `${heightPercent}%` }}
                    >
                      {/* Tooltip on Hover */}
                      <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1.5 px-3 rounded-xl shadow-xl font-bold whitespace-nowrap z-20 transition-opacity">
                        <p className="text-orange-400">${d.revenue.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-300 font-normal">{d.bookings} Bookings</p>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase">{d.month}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" /> Peak Month: September 2026
            </span>
            <span>Automated Daily Sync Active</span>
          </div>
        </div>

        {/* Fleet Breakdown & Top Performer */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          {/* Most Rented Car Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                Top Performer
              </span>
              <span className="text-xs text-slate-400 font-mono">Most Rented</span>
            </div>

            {mostRentedCar ? (
              <div className="space-y-3">
                <img
                  src={mostRentedCar.image}
                  alt={mostRentedCar.model}
                  className="w-full h-36 object-cover rounded-2xl shadow-sm"
                />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-lg">
                    {mostRentedCar.brand} {mostRentedCar.model}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{mostRentedCar.year} • {mostRentedCar.fuelType}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium">Reservations:</span>
                  <span className="font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg">
                    {carRentalCounts[mostRentedCarId] || 0} Bookings
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-6">No rental activity logged yet.</p>
            )}
          </div>

          {/* Fleet Status Breakdown */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-slate-900">Fleet Availability Status</h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available
                </span>
                <span className="font-bold text-slate-900">{availableCars} Cars</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Rented / On Road
                </span>
                <span className="font-bold text-slate-900">{rentedCars} Cars</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> In Maintenance
                </span>
                <span className="font-bold text-slate-900">{maintenanceCars} Cars</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Recent Rentals Feed */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" /> Live Reservation Feed
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Real-time status of current active & recent rental contracts</p>
          </div>

          <button
            onClick={() => navigate('/bookings')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition"
          >
            View All History <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="text-xs font-bold text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Reservation ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Rented Vehicle</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Total Amount</th>
                <th className="px-4 py-3 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.slice(0, 6).map((b) => {
                const customer = getCustomerById(b.customerId);
                const car = getCarById(b.carId);
                const custName = customer?.name || `${customer?.firstName || ''} ${customer?.lastName || ''}`;

                return (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3.5 font-mono text-xs font-bold text-orange-600">
                      {b.id.split('-')[1] || b.id}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">{custName || 'Customer'}</td>
                    <td className="px-4 py-3.5 text-slate-700 font-medium">
                      {car ? `${car.brand} ${car.model}` : 'Vehicle'}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">{b.totalDays} Days</td>
                    <td className="px-4 py-3.5 font-black text-slate-900">${b.totalCost}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
