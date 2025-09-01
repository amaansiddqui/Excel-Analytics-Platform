import React from 'react';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 ${className}`}>
      {children}
    </div>
  );
};