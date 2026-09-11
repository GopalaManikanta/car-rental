import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const elements = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {elements.map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-pulse">
            <div className="h-48 bg-slate-200 rounded-xl mb-4"></div>
            <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <div className="h-8 bg-slate-200 rounded w-1/3"></div>
              <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-pulse">
        <div className="h-12 bg-slate-100 border-b border-slate-200"></div>
        {elements.map((_, i) => (
          <div key={i} className="flex justify-between p-4 border-b border-slate-100">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-pulse">
      {elements.map((_, i) => (
        <div key={i} className="h-4 bg-slate-200 rounded w-full"></div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
