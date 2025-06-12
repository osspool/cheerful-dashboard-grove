
import React from 'react';
import { usePOS } from '../context/POSContext';
import { usePOSProducts } from '../hooks/usePOSProducts';
import { POSExpandableProductCard } from './POSExpandableProductCard';

interface POSProductGridProps {
  searchQuery: string;
}

export const POSProductGrid = ({ searchQuery }: POSProductGridProps) => {
  const { data: products, isLoading } = usePOSProducts(searchQuery);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-muted rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {searchQuery ? 'No products found matching your search.' : 'Start typing to search for products.'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <POSExpandableProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
