import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Fuel, Gauge, Users, Calendar, Edit3, Trash2, Eye, DollarSign } from 'lucide-react';

const CarCard = ({ car, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Booked':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Maintenance':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200 hover:border-orange-400 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 flex flex-col group">
      {/* Image Banner & Status Badge */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md border border-slate-200 text-slate-900 font-bold text-xs rounded-full shadow-sm">
            {car.brand}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 backdrop-blur-md border text-xs font-bold rounded-full shadow-sm ${getStatusBadge(
              car.availabilityStatus
            )}`}
          >
            {car.availabilityStatus}
          </span>
        </div>

        <div className="absolute bottom-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-lg backdrop-blur-sm shadow">
          ${car.pricePerDay} <span className="font-normal text-[10px] text-orange-100">/ day</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition truncate">
              {car.brand} {car.model}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {car.description || `${car.year} model premium car engineered for comfort and performance.`}
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2.5 py-3 border-y border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Fuel className="w-4 h-4 text-orange-500" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-amber-500" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-500" />
            <span>{car.seatingCapacity} Seats</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-600" />
            <span>{car.year} Model</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => navigate(`/cars/${car.id}`)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-xs transition duration-200 shadow-sm"
          >
            <Eye className="w-4 h-4" />
            <span>Details</span>
          </button>

          <button
            onClick={() => onEdit(car)}
            className="p-2.5 bg-slate-100 hover:bg-orange-50 text-slate-600 hover:text-orange-600 border border-slate-200 rounded-xl transition"
            title="Edit Vehicle"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(car)}
            className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl transition"
            title="Delete Vehicle"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
