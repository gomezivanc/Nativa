import React from 'react';
import { useLoading } from './preloadContext';

const LoadingIndicator = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center" style={{ zIndex: 100000000000000 }}>
      <i className="pi pi-spin pi-spinner text-white"  style={{ fontSize: '4rem' }}></i>
    </div>
  );
};

export default LoadingIndicator;
