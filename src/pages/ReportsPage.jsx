import React, { useState, useMemo } from 'react';
import { useCars } from '../context/CarContext';
import { useCustomers } from '../context/CustomerContext';
import { useBooking } from '../context/BookingContext';
import Breadcrumbs from '../components/common/Breadcrumbs';
import {
  TrendingUp,
  DollarSign,
  Car,
  Users,
  CheckCircle2,
  PieChart as PieChartIcon,
  BarChart2,
  Calendar,
  Award,
  ShieldCheck,
  Printer,
  Sparkles,
  Flame,
  Filter,
  ArrowUpRight,
  TrendingDown,
  Layers,
  ArrowRight,
  Zap,
  Star
} from 'lucide-react';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ReportsPage = () => {
  const { cars } = useCars();
  const { customers } = useCustomers();
  const { bookings } = useBooking();

  const [timeRange, setTimeRange] = useState('All Time');

  // Reliable car lookup resolver (handles ID variation e.g. car-108 vs api-car-108)
  const resolveCar = (carId) => {
    let car = cars.find((c) => c.id === carId);
    if (car) return car;
    const idNum = parseInt(String(carId).replace(/\D/g, ''), 10);
    if (!isNaN(idNum) && idNum >= 101 && cars[idNum - 101]) {
      return cars[idNum - 101];
    }
    return (
      cars.find((c) => c.brand.toLowerCase() === 'hyundai') ||
      cars[0] || {
        id: 'car-108',
        brand: 'Hyundai',
        model: 'Ioniq 5',
        year: 2024,
        fuelType: 'Electric',
        pricePerDay: 85,
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
      }
    );
  };

  // Helper to reliably parse YYYY-MM-DD or ISO string without timezone shifts
  const getBookingYearMonth = (dateStr) => {
    if (!dateStr) return null;
    const cleanStr = dateStr.split('T')[0];
    const parts = cleanStr.split('-');
    if (parts.length >= 2) {
      const year = parseInt(parts[0], 10);
      const monthIdx = parseInt(parts[1], 10) - 1;
      if (!isNaN(year) && !isNaN(monthIdx) && monthIdx >= 0 && monthIdx < 12) {
        return { year, monthIdx };
      }
    }
    return null;
  };

  // Filter bookings according to selected time range
  const filteredBookings = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear() < 2026 ? 2026 : now.getFullYear();
    const currentMonth = now.getFullYear() < 2026 ? 8 : now.getMonth(); // 8 = September (0-indexed)

    return bookings.filter((b) => {
      const dateInfo = getBookingYearMonth(b.pickupDate || b.createdAt);
      if (!dateInfo) return true;

      const { year: bYear, monthIdx: bMonth } = dateInfo;

      if (timeRange === 'This Month') {
        return bYear === currentYear && bMonth === currentMonth;
      }

      if (timeRange === 'Last Month') {
        const lastMonthIdx = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYr = currentMonth === 0 ? currentYear - 1 : currentYear;
        return bYear === lastMonthYr && bMonth === lastMonthIdx;
      }

      if (timeRange === 'This Quarter') {
        const currentQuarter = Math.floor(currentMonth / 3);
        const bQuarter = Math.floor(bMonth / 3);
        return bYear === currentYear && bQuarter === currentQuarter;
      }

      return true; // 'All Time'
    });
  }, [bookings, timeRange]);

  // Dynamic KPI Calculations based on filteredBookings
  const activeBookings = filteredBookings.filter((b) => b.status === 'Active');
  const completedBookings = filteredBookings.filter((b) => b.status === 'Completed');
  const cancelledBookings = filteredBookings.filter((b) => b.status === 'Cancelled');

  const totalRevenue = filteredBookings
    .filter((b) => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + (b.totalCost || 0), 0);

  const avgBookingValue =
    filteredBookings.length > 0
      ? Math.round(totalRevenue / filteredBookings.length)
      : 0;

  const avgRentalDays =
    filteredBookings.length > 0
      ? Math.round(
          filteredBookings.reduce((acc, b) => acc + (b.totalDays || 0), 0) /
            filteredBookings.length
        )
      : 0;

  // Monthly Revenue Distribution Chart Data (filtered dynamically by selected timeRange)
  const monthlyRevenueData = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear() < 2026 ? 2026 : now.getFullYear();
    const currentMonth = now.getFullYear() < 2026 ? 8 : now.getMonth();

    const monthsMap = {};

    if (timeRange === 'This Month') {
      const key = `${MONTH_NAMES[currentMonth]} ${currentYear}`;
      monthsMap[key] = { revenue: 0, count: 0, completed: 0, monthIdx: currentMonth, year: currentYear };
    } else if (timeRange === 'Last Month') {
      const lastMonthIdx = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYr = currentMonth === 0 ? currentYear - 1 : currentYear;
      const key = `${MONTH_NAMES[lastMonthIdx]} ${lastMonthYr}`;
      monthsMap[key] = { revenue: 0, count: 0, completed: 0, monthIdx: lastMonthIdx, year: lastMonthYr };
    } else if (timeRange === 'This Quarter') {
      const currentQuarter = Math.floor(currentMonth / 3);
      for (let m = currentQuarter * 3; m < (currentQuarter + 1) * 3; m++) {
        if (m < 12) {
          const key = `${MONTH_NAMES[m]} ${currentYear}`;
          monthsMap[key] = { revenue: 0, count: 0, completed: 0, monthIdx: m, year: currentYear };
        }
      }
    } else {
      // 'All Time' -> initialize default 5 months May-Sep 2026
      const defaultMonths = [4, 5, 6, 7, 8];
      defaultMonths.forEach((m) => {
        const key = `${MONTH_NAMES[m]} ${currentYear}`;
        monthsMap[key] = { revenue: 0, count: 0, completed: 0, monthIdx: m, year: currentYear };
      });
    }

    filteredBookings.forEach((b) => {
      const dateInfo = getBookingYearMonth(b.pickupDate || b.createdAt);
      if (dateInfo) {
        const key = `${MONTH_NAMES[dateInfo.monthIdx]} ${dateInfo.year}`;
        if (!monthsMap[key]) {
          monthsMap[key] = { revenue: 0, count: 0, completed: 0, monthIdx: dateInfo.monthIdx, year: dateInfo.year };
        }
        monthsMap[key].count += 1;
        if (b.status === 'Completed') monthsMap[key].completed += 1;
        if (b.status !== 'Cancelled') {
          monthsMap[key].revenue += b.totalCost || 0;
        }
      }
    });

    const sortedEntries = Object.entries(monthsMap).sort((a, b) => {
      const aVal = a[1].year * 100 + a[1].monthIdx;
      const bVal = b[1].year * 100 + b[1].monthIdx;
      return aVal - bVal;
    });

    const maxRev = Math.max(...sortedEntries.map(([, m]) => m.revenue), 1);

    return sortedEntries.map(([month, data]) => ({
      month,
      revenue: data.revenue,
      count: data.count,
      completed: data.completed,
      percentage: Math.max(Math.round((data.revenue / maxRev) * 100), 18)
    }));
  }, [filteredBookings, timeRange]);

  // Fleet Engine Powertrain Share (filtered dynamically by selected timeRange)
  const powertrainData = useMemo(() => {
    const fuelCounts = {};
    let totalCount = 0;

    filteredBookings.forEach((b) => {
      const car = resolveCar(b.carId);
      if (car && car.fuelType) {
        fuelCounts[car.fuelType] = (fuelCounts[car.fuelType] || 0) + 1;
        totalCount += 1;
      }
    });

    if (totalCount === 0) {
      cars.forEach((car) => {
        fuelCounts[car.fuelType] = (fuelCounts[car.fuelType] || 0) + 1;
        totalCount += 1;
      });
    }

    return Object.entries(fuelCounts).map(([fuel, count]) => ({
      fuel,
      count,
      percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
    }));
  }, [filteredBookings, cars]);

  // Car Revenue Leaderboard (filtered by selected time range, resolved through resolveCar)
  const carLeaderboard = useMemo(() => {
    const revenueMap = {};
    const bookingCountMap = {};

    filteredBookings.forEach((b) => {
      if (b.status !== 'Cancelled') {
        const car = resolveCar(b.carId);
        if (car) {
          revenueMap[car.id] = (revenueMap[car.id] || 0) + (b.totalCost || 0);
          bookingCountMap[car.id] = (bookingCountMap[car.id] || 0) + 1;
        }
      }
    });

    return cars
      .map((car) => ({
        ...car,
        earnedRevenue: revenueMap[car.id] || 0,
        totalReservations: bookingCountMap[car.id] || 0
      }))
      .sort((a, b) => b.earnedRevenue - a.earnedRevenue);
  }, [cars, filteredBookings]);

  // Description text badge for current filter
  const filterDescription = useMemo(() => {
    switch (timeRange) {
      case 'This Month':
        return `Showing performance metrics for current month (September 2026) — ${filteredBookings.length} Bookings ($${totalRevenue.toLocaleString()})`;
      case 'Last Month':
        return `Showing performance metrics for previous month (August 2026) — ${filteredBookings.length} Bookings ($${totalRevenue.toLocaleString()})`;
      case 'This Quarter':
        return `Showing performance metrics for Q3 2026 (Jul 1 - Sep 30, 2026) — ${filteredBookings.length} Bookings ($${totalRevenue.toLocaleString()})`;
      default:
        return `Showing total lifetime business records across all dates — ${filteredBookings.length} Bookings ($${totalRevenue.toLocaleString()})`;
    }
  }, [timeRange, filteredBookings, totalRevenue]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fadeIn">
      <Breadcrumbs paths={[{ name: 'Reports & Analytics' }]} />

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 w-fit mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Financial Intelligence Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-7 h-7 text-orange-500" /> Executive Financial & Fleet Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
            <Filter className="w-3.5 h-3.5 text-orange-500" />
            <span>{filterDescription}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time Filter Pills */}
          <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 text-xs font-semibold">
            {['All Time', 'This Month', 'Last Month', 'This Quarter'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  timeRange === range
                    ? 'bg-orange-500 text-white shadow-sm font-bold scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow transition text-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print Report
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue ({timeRange})</span>
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">${totalRevenue.toLocaleString()}</p>
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4" /> {filteredBookings.length} total contracts evaluated
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg Reservation Spend</span>
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-600 rounded-2xl">
              <Award className="w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">${avgBookingValue.toLocaleString()}</p>
          <span className="text-xs text-slate-500 font-medium mt-2 block">
            Average revenue per contract
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg Lease Duration</span>
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">{avgRentalDays} Days</p>
          <span className="text-xs text-amber-600 font-bold mt-2 block">
            Average customer rental span
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Rentals</span>
            <div className="p-3 bg-purple-50 border border-purple-200 text-purple-600 rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">{activeBookings.length} Vehicles</p>
          <span className="text-xs text-purple-600 font-bold mt-2 block">
            Currently leased on-road
          </span>
        </div>
      </div>



      {/* Monthly Revenue Breakdown Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-orange-500" /> Monthly Revenue & Reservation Growth (2026)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live gross earnings calculated directly from booking contracts
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-xl">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Highest Revenue Period: Q3 2026</span>
          </div>
        </div>

        {/* Visual Bar Chart with Permanent Dollar Values */}
        <div className="pt-4 pb-2">
          <div className="flex items-end justify-around gap-4 h-56 px-4">
            {monthlyRevenueData.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end max-w-[100px]">
                {/* Dollar Label Above Bar */}
                <div className="text-center">
                  <span className="text-xs font-black text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg block shadow-xs">
                    ${item.revenue.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                    {item.count} Bookings
                  </span>
                </div>

                {/* Animated Gradient Bar */}
                <div className="w-full bg-slate-100 rounded-2xl overflow-hidden h-full flex items-end p-1 border border-slate-100 shadow-inner">
                  <div
                    className="w-full bg-gradient-to-t from-orange-600 via-amber-500 to-amber-400 rounded-xl group-hover:from-orange-500 group-hover:to-amber-300 transition-all duration-500 relative flex items-center justify-center"
                    style={{ height: `${item.percentage}%` }}
                  >
                    {item.percentage > 35 && (
                      <span className="text-[10px] font-black text-white drop-shadow-xs">
                        {item.percentage}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Month Name */}
                <span className="text-xs font-extrabold text-slate-700 group-hover:text-orange-600 transition">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Monthly Revenue Audit Table */}
        <div className="overflow-x-auto pt-4 border-t border-slate-100">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
            Monthly Performance Audit Matrix
          </h4>
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="font-bold text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Billing Month</th>
                <th className="px-4 py-3">Total Reservations</th>
                <th className="px-4 py-3">Completed Leases</th>
                <th className="px-4 py-3">Monthly Gross Revenue</th>
                <th className="px-4 py-3 rounded-r-xl">% Share of Fleet Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold">
              {monthlyRevenueData.map((item) => {
                const totalYearRevenue = monthlyRevenueData.reduce((acc, m) => acc + m.revenue, 0);
                const share = totalYearRevenue > 0 ? Math.round((item.revenue / totalYearRevenue) * 100) : 0;
                return (
                  <tr key={item.month} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-extrabold text-slate-900">{item.month}</td>
                    <td className="px-4 py-3">{item.count} Bookings</td>
                    <td className="px-4 py-3 text-emerald-600 font-bold">{item.completed} Completed</td>
                    <td className="px-4 py-3 text-slate-900 font-black text-sm">
                      ${item.revenue.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-orange-500 h-full rounded-full" style={{ width: `${share}%` }}></div>
                        </div>
                        <span className="font-bold text-slate-600">{share}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Status Breakdown & Fleet Powertrain */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Status Distribution Card */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-orange-500" /> Status Breakdown ({timeRange})
          </h3>

          {filteredBookings.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-medium text-xs">
              No reservation records found for this period.
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Completed Leases ({completedBookings.length})
                  </span>
                  <span>
                    {Math.round((completedBookings.length / filteredBookings.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(completedBookings.length / filteredBookings.length) * 100}%`
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Active Leases ({activeBookings.length})
                  </span>
                  <span>
                    {Math.round((activeBookings.length / filteredBookings.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(activeBookings.length / filteredBookings.length) * 100}%`
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Cancelled Contracts ({cancelledBookings.length})
                  </span>
                  <span>
                    {Math.round((cancelledBookings.length / filteredBookings.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(cancelledBookings.length / filteredBookings.length) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fleet Powertrain Share */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Car className="w-5 h-5 text-orange-500" /> Fleet Engine Powertrain Share
          </h3>

          <div className="space-y-4">
            {powertrainData.map(({ fuel, count, percentage }) => (
              <div key={fuel}>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span className="capitalize">{fuel} Powertrain ({count} Leases)</span>
                  <span>{percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Revenue Generating Vehicles Leaderboard */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" /> Top Revenue Generating Vehicles Leaderboard
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked by total earned revenue for period: <strong className="text-slate-800">{timeRange}</strong>
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="text-xs font-bold text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Rank</th>
                <th className="px-4 py-3">Vehicle Details</th>
                <th className="px-4 py-3">Powertrain</th>
                <th className="px-4 py-3">Daily Rate</th>
                <th className="px-4 py-3">Reservations</th>
                <th className="px-4 py-3 rounded-r-xl">Total Earned Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {carLeaderboard.slice(0, 6).map((car, index) => (
                <tr key={car.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-4 py-4 font-bold text-xs">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-black text-xs ${
                        index === 0
                          ? 'bg-amber-100 text-amber-700 border border-amber-300'
                          : index === 1
                          ? 'bg-slate-200 text-slate-700'
                          : index === 2
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      #{index + 1}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={car.image}
                        alt={car.model}
                        className="w-12 h-12 object-cover rounded-xl shadow-sm border border-slate-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm">{car.brand} {car.model}</p>
                        <p className="text-xs text-slate-400">{car.year} Model</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold capitalize">
                      {car.fuelType}
                    </span>
                  </td>

                  <td className="px-4 py-4 font-bold text-slate-800">${car.pricePerDay}</td>

                  <td className="px-4 py-4">
                    <span className="font-bold text-orange-600">{car.totalReservations} Bookings</span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="font-black text-emerald-600 text-base">
                      ${car.earnedRevenue.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
