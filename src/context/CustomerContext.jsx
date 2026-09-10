import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { customerService } from '../services/api';

const CustomerContext = createContext(null);

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const data = customerService.getCustomers();
    setCustomers(data);
  }, []);

  const saveAndSetCustomers = (updated) => {
    setCustomers(updated);
    customerService.saveCustomersToStorage(updated);
  };

  const addCustomer = (customerData) => {
    const newCustomer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      status: customerData.status || 'Active',
      registeredDate: new Date().toISOString().split('T')[0]
    };
    const updated = [newCustomer, ...customers];
    saveAndSetCustomers(updated);
    return newCustomer;
  };

  const updateCustomer = (id, customerData) => {
    const updated = customers.map((c) => (c.id === id ? { ...c, ...customerData } : c));
    saveAndSetCustomers(updated);
  };

  const deleteCustomer = (id) => {
    const updated = customers.filter((c) => c.id !== id);
    saveAndSetCustomers(updated);
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const term = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.mobile.includes(term) ||
        c.licenseNumber.toLowerCase().includes(term)
      );
    });
  }, [customers, searchTerm]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;

  const paginatedCustomers = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredCustomers, currentPage, itemsPerPage]);

  useEffect(() => {
    // Reset to page 1 on search change
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <CustomerContext.Provider
      value={{
        customers,
        filteredCustomers,
        paginatedCustomers,
        searchTerm,
        setSearchTerm,
        currentPage,
        setCurrentPage,
        totalPages,
        totalCustomers: filteredCustomers.length,
        addCustomer,
        updateCustomer,
        deleteCustomer
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
};
