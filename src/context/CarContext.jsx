import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { carService } from '../services/api';

const CarContext = createContext(null);

export const CarProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Sorting state
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('All');
  const [fuelFilter, setFuelFilter] = useState('All');
  const [transmissionFilter, setTransmissionFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  const fetchCars = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await carService.getCars();
      setCars(data);
    } catch (err) {
      setError('Failed to fetch car fleet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const saveAndSetCars = (updatedCars) => {
    setCars(updatedCars);
    carService.saveCarsToStorage(updatedCars);
  };

  const addCar = (newCarData) => {
    const newCar = {
      ...newCarData,
      id: `car-${Date.now()}`,
      availabilityStatus: newCarData.availabilityStatus || 'Available',
      image: newCarData.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
    };
    const updated = [newCar, ...cars];
    saveAndSetCars(updated);
    return newCar;
  };

  const updateCar = (id, updatedData) => {
    const updated = cars.map((car) => (car.id === id ? { ...car, ...updatedData } : car));
    saveAndSetCars(updated);
  };

  const deleteCar = (id) => {
    const updated = cars.filter((car) => car.id !== id);
    saveAndSetCars(updated);
  };

  const getCarById = (id) => {
    return cars.find((car) => car.id === id);
  };

  // Filter & Sort Logic
  const filteredCars = useMemo(() => {
    return cars
      .filter((car) => {
        const matchesSearch =
          car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.model.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBrand = brandFilter === 'All' || car.brand.toLowerCase() === brandFilter.toLowerCase();
        const matchesFuel = fuelFilter === 'All' || car.fuelType.toLowerCase() === fuelFilter.toLowerCase();
        const matchesTrans =
          transmissionFilter === 'All' || car.transmission.toLowerCase() === transmissionFilter.toLowerCase();

        return matchesSearch && matchesBrand && matchesFuel && matchesTrans;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.pricePerDay - b.pricePerDay;
        if (sortBy === 'price-high') return b.pricePerDay - a.pricePerDay;
        if (sortBy === 'year-new') return b.year - a.year;
        if (sortBy === 'brand') return a.brand.localeCompare(b.brand);
        return 0;
      });
  }, [cars, searchTerm, brandFilter, fuelFilter, transmissionFilter, sortBy]);

  const uniqueBrands = useMemo(() => {
    const brands = cars.map((c) => c.brand);
    return ['All', ...new Set(brands)];
  }, [cars]);

  return (
    <CarContext.Provider
      value={{
        cars,
        filteredCars,
        uniqueBrands,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        brandFilter,
        setBrandFilter,
        fuelFilter,
        setFuelFilter,
        transmissionFilter,
        setTransmissionFilter,
        sortBy,
        setSortBy,
        addCar,
        updateCar,
        deleteCar,
        getCarById,
        refetchCars: fetchCars
      }}
    >
      {children}
    </CarContext.Provider>
  );
};

export const useCars = () => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCars must be used within a CarProvider');
  }
  return context;
};
