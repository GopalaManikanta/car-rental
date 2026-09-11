import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ paths }) => {
  return (
    <nav className="flex items-center text-sm font-medium text-slate-500 mb-6">
      <Link to="/dashboard" className="hover:text-orange-600 flex items-center gap-1 transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      
      {paths.map((path, index) => {
        const isLast = index === paths.length - 1;
        return (
          <React.Fragment key={path.name}>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
            {isLast ? (
              <span className="text-slate-800 font-semibold">{path.name}</span>
            ) : (
              <Link to={path.link} className="hover:text-orange-600 transition-colors">
                {path.name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
