import React from 'react';
import { Link } from 'react-router-dom';

const LinkedInStyleLogo = ({ size = 'md', className = '', linkTo = '/' }) => {
  // Size variants
  const sizeClasses = {
    sm: {
      height: 'h-6',
      fontSize: 'text-sm',
      padding: 'px-1.5',
      cornerRadius: 'rounded'
    },
    md: {
      height: 'h-8',
      fontSize: 'text-base',
      padding: 'px-2',
      cornerRadius: 'rounded-md'
    },
    lg: {
      height: 'h-10',
      fontSize: 'text-xl',
      padding: 'px-3',
      cornerRadius: 'rounded-lg'
    },
    xl: {
      height: 'h-12',
      fontSize: 'text-2xl',
      padding: 'px-4',
      cornerRadius: 'rounded-lg'
    }
  };

  const { height, fontSize, padding, cornerRadius } = sizeClasses[size] || sizeClasses.md;

  return (
    <Link to={linkTo} className={`inline-flex items-center ${className}`}>
      <div className="flex items-center leading-none">
        <div className={`bg-primary ${height} ${padding} ${cornerRadius} flex items-center justify-center`}>
          <span className={`text-white ${fontSize} font-bold font-heading leading-none`}>kin</span>
        </div>
        <span className={`text-gray-800 ${fontSize} font-bold font-heading leading-none`} style={{ marginLeft: '-1px' }}>pin</span>
      </div>
    </Link>
  );
};

export default LinkedInStyleLogo;