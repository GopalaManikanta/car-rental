import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex flex-col justify-center items-center text-center p-6">
      <div className="w-20 h-20 bg-orange-50 border border-orange-200 rounded-3xl flex items-center justify-center text-orange-600 mb-6 shadow-sm">
        <Car className="w-10 h-10" />
      </div>
      <h1 className="text-6xl font-black text-slate-900">404</h1>
      <h2 className="text-xl font-bold text-slate-700 mt-2">Page Not Found</h2>
      <p className="text-slate-500 text-sm mt-1 max-w-md">
        The route you are trying to access does not exist or has been relocated.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold rounded-2xl text-sm transition shadow-md shadow-orange-500/30"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
