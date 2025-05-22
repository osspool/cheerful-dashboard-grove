import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface StockXListing {
  id: string;
  productId: string;
  variantId: string;
  price: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  amount?: string;
  ask?: string;
  order?: string;
  product?: string;
  // Adding additional properties to match expected type
  size?: string;
  listing_type?: string;
  time_created?: string;
  time_updated?: string;
  time_expires?: string;
}

export interface StockXListingsProps {
  listings: StockXListing[];
  isLoading: boolean; // Add isLoading prop
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
                <TableRow key={listing.id}>
                  <TableCell className="font-medium">{formatCurrency(parseFloat(listing.price))}</TableCell>
                  <TableCell>
                    <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                      {listing.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(listing.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(listing.expiresAt).toLocaleDateString()}</TableCell>
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
