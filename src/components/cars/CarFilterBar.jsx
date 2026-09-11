import React from 'react';
import { useCars } from '../../context/CarContext';
import { Search, Filter, RotateCcw, ArrowUpDown } from 'lucide-react';

const CarFilterBar = () => {
  const {
    searchTerm,
    setSearchTerm,
    brandFilter,
    setBrandFilter,
    fuelFilter,
    setFuelFilter,
    transmissionFilter,
    setTransmissionFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    uniqueBrands
  } = useCars();

  const resetFilters = () => {
    setSearchTerm('');
    setBrandFilter('All');
    setFuelFilter('All');
    setTransmissionFilter('All');
    setStatusFilter('All');
    setSortBy('default');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    brandFilter !== 'All' ||
    fuelFilter !== 'All' ||
    transmissionFilter !== 'All' ||
    statusFilter !== 'All' ||
    sortBy !== 'default';

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-md space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by brand or model (e.g. BMW, Tesla)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white text-sm transition"
          />
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {/* Brand Filter */}
          <div className="relative">
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 text-xs font-medium focus:outline-none focus:border-orange-500 focus:bg-white appearance-none pr-8 cursor-pointer"
            >
              <option value="All">Brand: All</option>
              {uniqueBrands
                .filter((b) => b !== 'All')
                .map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Fuel Filter */}
          <div className="relative">
            <select
              value={fuelFilter}
              onChange={(e) => setFuelFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 text-xs font-medium focus:outline-none focus:border-orange-500 focus:bg-white appearance-none pr-8 cursor-pointer"
            >
              <option value="All">Fuel: All</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Transmission Filter */}
          <div className="relative">
            <select
              value={transmissionFilter}
              onChange={(e) => setTransmissionFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 text-xs font-medium focus:outline-none focus:border-orange-500 focus:bg-white appearance-none pr-8 cursor-pointer"
            >
              <option value="All">Trans: All</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 text-xs font-medium focus:outline-none focus:border-orange-500 focus:bg-white appearance-none pr-8 cursor-pointer"
            >
              <option value="All">Status: All</option>
              <option value="Available">Available</option>
              <option value="Rented">Rented</option>
              <option value="Maintenance">Maintenance</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Sort By Price */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 text-xs font-medium focus:outline-none focus:border-orange-500 focus:bg-white appearance-none pr-8 cursor-pointer"
            >
              <option value="default">Sort: Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="year-new">Year: Newest First</option>
              <option value="brand">Brand: A to Z</option>
            </select>
            <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold rounded-2xl transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CarFilterBar;
