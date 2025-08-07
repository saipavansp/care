import React from 'react';
import { Link } from 'react-router-dom';

const LinkedInStyleLogo = ({ size = 'md', className = '', linkTo = '/' }) => {
  // Size variants
  const sizeClasses = {
    sm: {
      container: 'h-8',
      box: 'px-1.5 py-0.5 rounded',
      text: 'text-sm font-bold',
      spacing: '-ml-0.5'
    },
    md: {
      container: 'h-10',
      box: 'px-2 py-1 rounded-md',
      text: 'text-base font-bold',
      spacing: '-ml-1'
    },
    lg: {
      container: 'h-12',
      box: 'px-3 py-1.5 rounded-lg',
      text: 'text-xl font-bold',
      spacing: '-ml-1.5'
    },
    xl: {
      container: 'h-16',
      box: 'px-4 py-2 rounded-lg',
      text: 'text-2xl font-bold',
      spacing: '-ml-2'
    }
  };

  const { container, box, text, spacing } = sizeClasses[size] || sizeClasses.md;

  return (
    <Link to={linkTo} className={`flex items-center ${container} ${className}`}>
      <div className="flex items-center">
        <div className={`bg-primary ${box} flex items-center justify-center`}>
          <span className={`text-white ${text} font-heading`}>kin</span>
        </div>
        <span className={`text-gray-800 ${text} font-bold font-heading ${spacing}`}>pin</span>
      </div>
    </Link>
  );
};

export default LinkedInStyleLogo;