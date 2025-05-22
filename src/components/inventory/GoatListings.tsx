import React from 'react';

export interface GoatListing {
  id: string;
  productId: string;
  size: string;
  price: string;
  condition: string;
  packagingCondition: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  // Additional properties required by the type
  catalog_id?: string;
  packaging_condition?: string;
  size_unit?: string;
  sku?: string;
  // And 7 more properties
  box_condition?: string;
  product_condition?: string;
  time_created?: string;
  time_updated?: string;
  time_expires?: string;
  listing_type?: string;
  amount?: string;
}

export interface GoatListingsProps {
  listings: GoatListing[];
  isLoading: boolean; // Add isLoading prop
  lastUpdated: string;
  filterBySize: string;
}

export const GoatListings = ({ listings, lastUpdated, filterBySize, isLoading }: GoatListingsProps) => {
  // ... keep existing code
}
