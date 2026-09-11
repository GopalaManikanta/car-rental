import React from 'react';
import { PackageOpen } from 'lucide-react';

const EmptyState = ({ title = 'No Data Found', message = 'There is nothing to display here yet.', icon: Icon = PackageOpen, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-200/60 shadow-sm border-dashed">
      <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{message}</p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};

export default EmptyState;
