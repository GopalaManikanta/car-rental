import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCustomers } from '../context/CustomerContext';
import CustomerFormModal from '../components/customers/CustomerFormModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Pagination from '../components/common/Pagination';
import { toast } from 'react-toastify';
import { Users, UserPlus, Search, Edit3, Trash2, Mail, Phone, ShieldCheck, MapPin, CreditCard } from 'lucide-react';

const CustomersPage = () => {
  const {
    paginatedCustomers,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer
  } = useCustomers();

  const [searchParams, setSearchParams] = useSearchParams();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      setIsFormOpen(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, data);
      toast.success(`Customer ${data.name} updated successfully!`);
    } else {
      addCustomer(data);
      toast.success(`Customer ${data.name} registered successfully!`);
    }
  };

  const handleConfirmDelete = () => {
    if (customerToDelete) {
      deleteCustomer(customerToDelete.id);
      toast.info(`Customer ${customerToDelete.name} removed from record.`);
      setCustomerToDelete(null);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-md">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-orange-500" /> Customer Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain registered driver profiles, verify licenses, and monitor active customer rentals.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold rounded-2xl shadow-md shadow-orange-500/30 transition text-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-md flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer by name, email, mobile, or driving license..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white text-sm transition"
          />
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md overflow-hidden">
        {paginatedCustomers.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="font-semibold text-slate-800">No Customers Found</p>
            <p className="text-xs text-slate-500 mt-1">Try refining your search keyword or register a new customer.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="text-xs font-semibold text-slate-600 uppercase bg-orange-50/60 border-b border-orange-100">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Customer Name</th>
                  <th className="px-4 py-3">Contact Details</th>
                  <th className="px-4 py-3">License Number</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-orange-50/40 transition">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-600 flex items-center justify-center font-bold text-white shadow">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{c.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">ID: {c.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 space-y-1">
                      <p className="text-xs text-slate-700 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-orange-500" /> {c.email}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-500" /> +91 {c.mobile}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-50 border border-orange-200 font-mono text-xs font-semibold text-orange-700">
                        <CreditCard className="w-3.5 h-3.5 text-orange-500" /> {c.licenseNumber}
                      </span>
                    </td>

                    <td className="px-4 py-4 max-w-xs truncate text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" /> {c.address}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          c.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-2 bg-slate-100 hover:bg-orange-50 text-slate-600 hover:text-orange-600 rounded-xl transition"
                          title="Edit Customer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(c)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p)}
          totalItems={totalCustomers}
          itemsPerPage={5}
        />
      </div>

      {/* Customer Form Modal */}
      <CustomerFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialCustomer={editingCustomer}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Customer"
        message={`Are you sure you want to remove customer profile for ${customerToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default CustomersPage;
