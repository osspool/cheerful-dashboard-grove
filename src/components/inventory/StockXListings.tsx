
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface StockXListing {
  id?: string;
  productId?: string;
  variantId?: string;
  price?: string;
  status?: string;
  createdAt?: string;
  expiresAt?: string;
  amount?: string;
  // Complex objects
  ask?: {
    askId: string;
    askCreatedAt: string;
    askUpdatedAt: string;
    askExpiresAt: string;
  };
  order?: any;
  product?: {
    productId: string;
    productName: string;
    styleId: string;
  };
  variant?: {
    variantId: string;
    variantName: string;
    variantValue: string;
  };
  // Additional properties
  currencyCode?: string;
  listingId?: string;
  inventoryType?: string;
  updatedAt?: string;
  authenticationDetails?: any;
  batch?: {
    batchId: string;
    taskId: string;
  };
  initiatedShipments?: any;
}

export interface StockXListingsProps {
  listings: StockXListing[];
  isLoading: boolean;
  lastUpdated: string;
  filterByVariantId: string;
}

export const StockXListings = ({ listings, lastUpdated, filterByVariantId, isLoading }: StockXListingsProps) => {
  const filteredListings = filterByVariantId 
    ? listings.filter(listing => listing.variantId === filterByVariantId)
    : listings;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span>StockX Listings</span>
          <Badge variant="outline" className="ml-2 text-xs">
            Last updated: {lastUpdated || 'Never'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : filteredListings.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Expires</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredListings.map((listing) => (
                <TableRow key={listing.id || listing.listingId}>
                  <TableCell className="font-medium">
                    {formatCurrency(listing.price || listing.amount || '0')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={listing.status?.toLowerCase() === 'active' ? 'default' : 'secondary'}>
                      {listing.status || 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {listing.expiresAt ? new Date(listing.expiresAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No StockX listings found
          </div>
        )}
      </CardContent>
    </Card>
  );
};
