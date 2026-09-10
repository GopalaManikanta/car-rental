import axios from 'axios';
import { INITIAL_CARS } from './mockCarData';
import { INITIAL_CUSTOMERS } from './mockCustomerData';

const API_BASE_URL = 'https://dummyjson.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
});

export const carService = {
  getCars: async () => {
    try {
      const stored = localStorage.getItem('car_rental_cars');
      if (stored) {
        return JSON.parse(stored);
      }

      // Try fetching third-party API or fallback to mock
      try {
        const response = await api.get('/products/category/vehicle');
        if (response.data && response.data.products && response.data.products.length > 0) {
          // Format DummyJSON vehicles to car rental structure if needed
          const apiCars = response.data.products.map((p, idx) => ({
            id: `api-car-${p.id}`,
            brand: p.brand || 'Vehicle',
            model: p.title.split(' ')[0] || `Model ${p.id}`,
            year: 2023,
            pricePerDay: Math.round(p.price) || 120,
            fuelType: idx % 3 === 0 ? 'Electric' : idx % 2 === 0 ? 'Hybrid' : 'Petrol',
            transmission: idx % 2 === 0 ? 'Automatic' : 'Manual',
            seatingCapacity: 5,
            availabilityStatus: 'Available',
            image: p.thumbnail || p.images?.[0] || INITIAL_CARS[idx % INITIAL_CARS.length].image,
            description: p.description || 'Premium rental vehicle.'
          }));
          const combined = [...INITIAL_CARS, ...apiCars];
          localStorage.setItem('car_rental_cars', JSON.stringify(combined));
          return combined;
        }
      } catch (err) {
        console.warn('Third-party API failed, utilizing local seed data:', err.message);
      }

      localStorage.setItem('car_rental_cars', JSON.stringify(INITIAL_CARS));
      return INITIAL_CARS;
    } catch (error) {
      console.error('Error in getCars:', error);
      return INITIAL_CARS;
    }
  },

  saveCarsToStorage: (cars) => {
    localStorage.setItem('car_rental_cars', JSON.stringify(cars));
  }
};

export const customerService = {
  getCustomers: () => {
    const stored = localStorage.getItem('car_rental_customers');
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem('car_rental_customers', JSON.stringify(INITIAL_CUSTOMERS));
    return INITIAL_CUSTOMERS;
  },

  saveCustomersToStorage: (customers) => {
    localStorage.setItem('car_rental_customers', JSON.stringify(customers));
  }
};

export default api;
