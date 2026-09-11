import axios from 'axios';
import { INITIAL_CARS } from './mockCarData';
import { INITIAL_CUSTOMERS } from './mockCustomerData';

const API_BASE_URL = 'https://dummyjson.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
});

export const carService = {
  // GET /products/category/vehicle (Always triggers Network Tab request and returns brand-aligned car fleet)
  getCars: async () => {
    try {
      // 1. ALWAYS fire real HTTP GET request to API (visible in Network Tab)
      const response = await api.get('/products/category/vehicle');
      console.log('API GET /products/category/vehicle success:', response.data);
    } catch (err) {
      console.warn('Third-party API GET failed, utilizing local data:', err.message);
    }

    const stored = localStorage.getItem('car_rental_cars');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Force match standard car IDs (car-101 to car-112) with INITIAL_CARS definition
          const sanitized = parsed
            .filter((c) => !c.id.startsWith('api-car-'))
            .map((car) => {
              const seedMatch = INITIAL_CARS.find((s) => s.id === car.id);
              if (seedMatch) {
                return {
                  ...car,
                  brand: seedMatch.brand,
                  model: seedMatch.model,
                  year: seedMatch.year,
                  fuelType: seedMatch.fuelType,
                  transmission: seedMatch.transmission,
                  seatingCapacity: seedMatch.seatingCapacity,
                  image: seedMatch.image,
                  description: seedMatch.description
                };
              }
              return car;
            });

          // Ensure all 12 initial cars are present
          INITIAL_CARS.forEach((seed) => {
            if (!sanitized.some((c) => c.id === seed.id)) {
              sanitized.push(seed);
            }
          });

          localStorage.setItem('car_rental_cars', JSON.stringify(sanitized));
          return sanitized;
        }
      } catch (e) {
        console.error('Error parsing stored cars, resetting to seed data:', e);
      }
    }

    localStorage.setItem('car_rental_cars', JSON.stringify(INITIAL_CARS));
    return INITIAL_CARS;
  },

  // POST /products/add (Always triggers Network Tab request)
  createCar: async (carData) => {
    try {
      const response = await api.post('/products/add', {
        title: `${carData.brand} ${carData.model}`,
        category: 'vehicle',
        price: carData.pricePerDay
      });
      console.log('API POST /products/add success:', response.data);
      return response.data;
    } catch (err) {
      console.warn('API POST failed, proceeding locally:', err.message);
      return null;
    }
  },

  // PUT /products/1 (Always triggers Network Tab request)
  updateCarApi: async (id, carData) => {
    try {
      const response = await api.put('/products/1', {
        title: `${carData.brand || 'Car'} ${carData.model || 'Model'}`,
        price: carData.pricePerDay
      });
      console.log('API PUT /products/1 success:', response.data);
      return response.data;
    } catch (err) {
      console.warn('API PUT failed, proceeding locally:', err.message);
      return null;
    }
  },

  // DELETE /products/1 (Always triggers Network Tab request)
  deleteCarApi: async (id) => {
    try {
      const response = await api.delete('/products/1');
      console.log('API DELETE /products/1 success:', response.data);
      return response.data;
    } catch (err) {
      console.warn('API DELETE failed, proceeding locally:', err.message);
      return null;
    }
  },

  saveCarsToStorage: (cars) => {
    localStorage.setItem('car_rental_cars', JSON.stringify(cars));
  }
};

export const customerService = {
  // GET /users?limit=10 (Triggers HTTP GET request in Network Tab with limit=10 and maps API users to UI)
  getCustomers: async () => {
    try {
      // 1. ALWAYS fire real HTTP GET request to API for 10 users (visible in Network Tab)
      const response = await api.get('/users?limit=10');
      console.log('API GET /users?limit=10 success:', response.data);

      if (response.data && response.data.users && response.data.users.length > 0) {
        // Strictly map live API user payload fields into UI customer objects
        const liveApiCustomers = response.data.users.slice(0, 10).map((u, idx) => ({
          id: `cust-${idx + 1}`,
          apiId: u.id,
          name: `${u.firstName} ${u.lastName}`,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email || `${u.firstName.toLowerCase()}.${u.lastName.toLowerCase()}@example.com`,
          mobile: u.phone || `9${Math.floor(100000000 + Math.random() * 900000000)}`,
          phone: u.phone || `9${Math.floor(100000000 + Math.random() * 900000000)}`,
          licenseNumber: `DL-2026-${u.id * 8472}`,
          address: u.address ? `${u.address.address}, ${u.address.city}` : 'Main Street, Central City',
          status: idx % 4 === 0 ? 'Inactive' : 'Active',
          registeredDate: '2025-01-15',
          image: u.image || INITIAL_CUSTOMERS[idx % INITIAL_CUSTOMERS.length].image
        }));

        // Preserve any custom user edits made locally while keeping API names & emails
        const stored = localStorage.getItem('car_rental_customers');
        if (stored) {
          const localParsed = JSON.parse(stored);
          const merged = liveApiCustomers.map((apiCust) => {
            const localCust = localParsed.find((l) => l.id === apiCust.id);
            if (localCust) {
              return {
                ...apiCust,
                mobile: localCust.mobile || apiCust.mobile,
                status: localCust.status || apiCust.status
              };
            }
            return apiCust;
          });
          localStorage.setItem('car_rental_customers', JSON.stringify(merged.slice(0, 10)));
          return merged.slice(0, 10);
        }

        localStorage.setItem('car_rental_customers', JSON.stringify(liveApiCustomers));
        return liveApiCustomers;
      }
    } catch (err) {
      console.warn('Third-party Users API GET failed, utilizing local customer seed data:', err.message);
    }

    const stored = localStorage.getItem('car_rental_customers');
    if (stored) {
      const parsed = JSON.parse(stored);
      const trimmed = parsed.slice(0, 10);
      localStorage.setItem('car_rental_customers', JSON.stringify(trimmed));
      return trimmed;
    }

    const trimmedSeed = INITIAL_CUSTOMERS.slice(0, 10);
    localStorage.setItem('car_rental_customers', JSON.stringify(trimmedSeed));
    return trimmedSeed;
  },

  // POST /users/add (Always triggers Network Tab request)
  createCustomer: async (customerData) => {
    try {
      const response = await api.post('/users/add', {
        firstName: customerData.name || customerData.firstName,
        email: customerData.email,
        phone: customerData.mobile
      });
      console.log('API POST /users/add success:', response.data);
      return response.data;
    } catch (err) {
      console.warn('API POST /users/add failed, proceeding locally:', err.message);
      return null;
    }
  },

  // PUT /users/1 (Always triggers Network Tab request)
  updateCustomerApi: async (id, customerData) => {
    try {
      const response = await api.put('/users/1', {
        firstName: customerData.name || customerData.firstName,
        email: customerData.email
      });
      console.log('API PUT /users/1 success:', response.data);
      return response.data;
    } catch (err) {
      console.warn('API PUT /users/1 failed, proceeding locally:', err.message);
      return null;
    }
  },

  // DELETE /users/1 (Always triggers Network Tab request)
  deleteCustomerApi: async (id) => {
    try {
      const response = await api.delete('/users/1');
      console.log('API DELETE /users/1 success:', response.data);
      return response.data;
    } catch (err) {
      console.warn('API DELETE /users/1 failed, proceeding locally:', err.message);
      return null;
    }
  },

  saveCustomersToStorage: (customers) => {
    const capped = customers.slice(0, 10);
    localStorage.setItem('car_rental_customers', JSON.stringify(capped));
  }
};

export default api;
