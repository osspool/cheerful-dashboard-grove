
import React from 'react';
import { POSMainInterface } from './components/POSMainInterface';
import { POSProvider } from './context/POSContext';

export const POSContent = () => {
  return (
    <POSProvider>
      <POSMainInterface />
    </POSProvider>
  );
};
