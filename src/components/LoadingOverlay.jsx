import React from 'react';

function LoadingOverlay({ isLoading }) {
  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 z-50 bg-porscheWhite bg-opacity-75 flex items-center justify-center">
      <div className="loader"></div>
    </div>
  );
}

export default LoadingOverlay;