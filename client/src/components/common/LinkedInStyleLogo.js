import React from 'react';
import { Link } from 'react-router-dom';

const LinkedInStyleLogo = ({ size = 'md', className = '', linkTo = '/' }) => {
  // Size variants
  const sizeClasses = {
    sm: {
      height: 'h-7',
      fontSize: 'text-base',
      padding: 'px-2',
      cornerRadius: 'rounded'
    },
    md: {
      height: 'h-9',
      fontSize: 'text-lg',
      padding: 'px-2.5',
      cornerRadius: 'rounded-md'
    },
    lg: {
      height: 'h-11',
      fontSize: 'text-2xl',
      padding: 'px-3.5',
      cornerRadius: 'rounded-lg'
    },
    xl: {
      height: 'h-14',
      fontSize: 'text-3xl',
      padding: 'px-5',
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
        <span className={`text-gray-800 ${fontSize} font-bold font-heading leading-none`} style={{ marginLeft: '2px' }}>pin</span>
      </div>
    </Link>
  );
};

export default LinkedInStyleLogo;