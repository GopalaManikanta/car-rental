import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCars } from '../context/CarContext';
import CarCard from '../components/cars/CarCard';
import CarFilterBar from '../components/cars/CarFilterBar';
import CarFormModal from '../components/cars/CarFormModal';
import QuickBookingModal from '../components/cars/QuickBookingModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { toast } from 'react-toastify';
import {
  Plus,
  Car as CarIcon,
  AlertCircle,
  RefreshCw,
  Layers,
  LayoutGrid,
  List,
  CheckCircle2,
  Clock,
  Wrench,
  Eye,
  Edit3,
  Trash2,
  Zap,
  TrendingUp,
  Fuel
} from 'lucide-react';

const CarsPage = () => {
  const navigate = useNavigate();
  const { cars, filteredCars, loading, error, addCar, updateCar, deleteCar, refetchCars } = useCars();
  const [searchParams, setSearchParams] = useSearchParams();

  // View mode switcher: 'grid' or 'list'
  const [viewMode, setViewMode] = useState('grid');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);

  const [quickBookCar, setQuickBookCar] = useState(null);
  const [isQuickBookOpen, setIsQuickBookOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      setIsFormOpen(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  // Fleet Overview KPI metrics
  const totalFleet = cars.length;
  const availableCount = cars.filter((c) => c.availabilityStatus === 'Available').length;
  const bookedCount = cars.filter(
    (c) => c.availabilityStatus === 'Booked' || c.availabilityStatus === 'Rented'
  ).length;
  const maintenanceCount = cars.filter((c) => c.availabilityStatus === 'Maintenance').length;

  const handleOpenAddModal = () => {
    setEditingCar(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (car) => {
    setEditingCar(car);
    setIsFormOpen(true);
  };

  const handleOpenDeleteDialog = (car) => {
    setCarToDelete(car);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = (carData) => {
    if (editingCar) {
      updateCar(editingCar.id, carData);
      toast.success(`${carData.brand} ${carData.model} updated successfully!`);
    } else {
      addCar(carData);
      toast.success(`New vehicle ${carData.brand} ${carData.model} added to fleet!`);
    }
  };

  const handleConfirmDelete = () => {
    if (carToDelete) {
      deleteCar(carToDelete.id);
      toast.info(`${carToDelete.brand} ${carToDelete.model} deleted from inventory.`);
      setCarToDelete(null);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto">
      <Breadcrumbs paths={[{ name: 'Car Fleet Operations' }]} />

      {/* Executive Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 w-fit mb-2">
            <CarIcon className="w-3.5 h-3.5" /> Fleet Management Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            Enterprise Car Fleet Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor real-time vehicle status, inspect powertrain specs, and dispatch instant customer rentals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Switcher */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-sm font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-orange-500" /> Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-sm font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5 text-orange-500" /> List Matrix
            </button>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-2xl shadow-md shadow-orange-500/20 transition text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Vehicle</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registered Fleet</span>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalFleet} Vehicles</p>
          <span className="text-xs text-slate-500 font-medium mt-1 block">Active Inventory</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Ready for Rent</span>
          <p className="text-2xl font-black text-emerald-600 mt-2">{availableCount} Available</p>
          <span className="text-xs text-emerald-600 font-bold mt-1 block">Instant dispatch eligible</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">On Road (Leased)</span>
          <p className="text-2xl font-black text-blue-600 mt-2">{bookedCount} Leased</p>
          <span className="text-xs text-blue-600 font-bold mt-1 block">Active customer rentals</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">In Maintenance</span>
          <p className="text-2xl font-black text-rose-600 mt-2">{maintenanceCount} Servicing</p>
          <span className="text-xs text-rose-600 font-bold mt-1 block">Scheduled servicing</span>
        </div>
      </div>

      {/* Filters Toolbar */}
      <CarFilterBar />

      {/* Loading State */}
      {loading && (
        <div className="py-20 text-center space-y-4">
          <div className="inline-block w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-slate-600 text-sm font-medium">Synchronizing fleet inventory database...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">Failed to Load Fleet</h3>
          <p className="text-slate-600 text-xs">{error}</p>
          <button
            onClick={refetchCars}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-500 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry Fetch
          </button>
        </div>
      )}

      {/* Cars Grid / List View */}
      {!loading && !error && (
        <>
          {filteredCars.length === 0 ? (
            <div className="py-16 text-center bg-white border border-slate-200 rounded-3xl p-8 space-y-3">
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Vehicles Match Your Search</h3>
              <p className="text-slate-500 text-xs max-w-md mx-auto">
                Try adjusting your brand, fuel type, transmission filters, or search term to discover cars in fleet.
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  onEdit={handleOpenEditModal}
                  onDelete={handleOpenDeleteDialog}
                  onBook={(c) => {
                    setQuickBookCar(c);
                    setIsQuickBookOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            /* Enterprise Table Inventory View */
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="text-xs font-bold text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3 rounded-l-xl">Vehicle Details</th>
                      <th className="px-4 py-3">Powertrain</th>
                      <th className="px-4 py-3">Capacity</th>
                      <th className="px-4 py-3">Daily Rate</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 rounded-r-xl text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCars.map((car) => {
                      const isAvailable = car.availabilityStatus === 'Available';
                      return (
                        <tr key={car.id} className="hover:bg-slate-50/80 transition">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={car.image}
                                alt={`${car.brand} ${car.model}`}
                                className="w-14 h-11 object-cover rounded-xl shadow-xs border border-slate-200 shrink-0"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
                                }}
                              />
                              <div>
                                <p className="font-extrabold text-slate-900 text-sm">
                                  {car.brand} {car.model}
                                </p>
                                <p className="text-xs text-slate-400">{car.year} Model</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="space-y-0.5">
                              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold block w-fit">
                                {car.fuelType}
                              </span>
                              <span className="text-[11px] text-slate-400">{car.transmission}</span>
                            </div>
                          </td>

                          <td className="px-4 py-4 font-semibold text-slate-800 text-xs">
                            {car.seatingCapacity} Seats
                          </td>

                          <td className="px-4 py-4">
                            <span className="font-black text-slate-900 text-base">${car.pricePerDay}</span>
                            <span className="text-[10px] text-slate-400"> / day</span>
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                isAvailable
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : car.availabilityStatus === 'Maintenance'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}
                            >
                              {car.availabilityStatus}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isAvailable && (
                                <button
                                  onClick={() => {
                                    setQuickBookCar(car);
                                    setIsQuickBookOpen(true);
                                  }}
                                  className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1 cursor-pointer"
                                >
                                  <Zap className="w-3.5 h-3.5" /> Book
                                </button>
                              )}

                              <button
                                onClick={() => navigate(`/cars/${car.id}`)}
                                className="p-2 bg-slate-100 hover:bg-orange-50 text-slate-600 hover:text-orange-600 rounded-xl transition cursor-pointer"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleOpenEditModal(car)}
                                className="p-2 bg-slate-100 hover:bg-orange-50 text-slate-600 hover:text-orange-600 rounded-xl transition cursor-pointer"
                                title="Edit Vehicle"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleOpenDeleteDialog(car)}
                                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition cursor-pointer"
                                title="Delete Vehicle"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Car Form Modal */}
      <CarFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialCar={editingCar}
      />

      {/* Quick Instant Reservation Modal */}
      <QuickBookingModal
        isOpen={isQuickBookOpen}
        onClose={() => setIsQuickBookOpen(false)}
        car={quickBookCar}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Vehicle"
        message={`Are you sure you want to remove ${carToDelete?.brand} ${carToDelete?.model} from the fleet? This action cannot be undone.`}
        confirmText="Delete Vehicle"
      />
    </div>
  );
};

export default CarsPage;
