import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCars } from '../context/CarContext';
import CarCard from '../components/cars/CarCard';
import CarFilterBar from '../components/cars/CarFilterBar';
import CarFormModal from '../components/cars/CarFormModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { toast } from 'react-toastify';
import { Plus, Car as CarIcon, AlertCircle, RefreshCw, Layers } from 'lucide-react';

const CarsPage = () => {
  const { filteredCars, loading, error, addCar, updateCar, deleteCar, refetchCars } = useCars();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);

  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      setIsFormOpen(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

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
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-md">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <CarIcon className="w-7 h-7 text-orange-500" /> Car Fleet Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse, filter, edit, or add vehicles to your active car rental fleet.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold rounded-2xl shadow-md shadow-orange-500/30 transition text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Car</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <CarFilterBar />

      {/* Loading State */}
      {loading && (
        <div className="py-20 text-center space-y-4">
          <div className="inline-block w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-slate-600 text-sm font-medium">Loading car fleet database...</p>
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

      {/* Cars Grid */}
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  onEdit={handleOpenEditModal}
                  onDelete={handleOpenDeleteDialog}
                />
              ))}
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
