import React from 'react';

function LoadingSpinner() {
  return (
    <div className="flex justify-center my-6">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );
}

export default LoadingSpinner;
