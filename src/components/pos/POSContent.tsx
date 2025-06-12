
import React from 'react';
import { POSProductSearch } from './components/POSProductSearch';
import { POSCart } from './components/POSCart';
import { POSProvider } from './context/POSContext';

export const POSContent = () => {
  return (
    <POSProvider>
      <div className="flex h-full">
        {/* Product Selection Side */}
        <div className="flex-1 border-r bg-background">
          <POSProductSearch />
        </div>
        
        {/* Cart/Checkout Side */}
        <div className="w-96 bg-card/30">
          <POSCart />
        </div>
      </div>
    </POSProvider>
  );
};
