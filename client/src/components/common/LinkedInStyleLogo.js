import React from 'react';
import { Link } from 'react-router-dom';

const LinkedInStyleLogo = ({ size = 'md', className = '', linkTo = '/' }) => {
  // Size variants
  const sizeClasses = {
    sm: {
      container: 'h-8',
      box: 'px-1.5 py-0.5 rounded',
      textIn: 'text-sm font-bold',
      textOut: 'text-sm font-semibold'
    },
    md: {
      container: 'h-10',
      box: 'px-2 py-1 rounded-md',
      textIn: 'text-base font-bold',
      textOut: 'text-base font-semibold'
    },
    lg: {
      container: 'h-12',
      box: 'px-3 py-1.5 rounded-lg',
      textIn: 'text-xl font-bold',
      textOut: 'text-xl font-semibold'
    },
    xl: {
      container: 'h-16',
      box: 'px-4 py-2 rounded-lg',
      textIn: 'text-2xl font-bold',
      textOut: 'text-2xl font-semibold'
    }
  };

  const { container, box, textIn, textOut } = sizeClasses[size] || sizeClasses.md;

  return (
    <Link to={linkTo} className={`flex items-center ${container} ${className}`}>
      <div className="flex">
        <div className={`bg-primary ${box} flex items-center justify-center`}>
          <span className="text-white ${textIn}">kin</span>
        </div>
        <span className={`text-gray-800 ${textOut}`}>pin</span>
      </div>
    </Link>
  );
};

export default LinkedInStyleLogo;