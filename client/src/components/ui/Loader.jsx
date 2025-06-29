import React from 'react';

const Loader = ({ size = 'md', color = 'primary' }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4'
  };

  const colors = {
    primary: 'border-purple-500',
    white: 'border-white',
    gray: 'border-gray-500'
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-t-transparent ${sizes[size]} ${colors[color]} border-solid`}
      ></div>
    </div>
  );
};

export default Loader;
