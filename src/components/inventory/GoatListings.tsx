
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface GoatListing {
  id: string;
  productId?: string;
  size: string | number;
  price?: string;
  condition: string;
  packagingCondition?: string;
  status: string;
  createdAt?: string;
  expiresAt?: string;
  // Additional properties required by the type
  catalog_id?: string;
  packaging_condition?: string;
  size_unit?: string;
  sku?: string;
  // And more properties
  box_condition?: string;
  product_condition?: string;
  time_created?: string;
  time_updated?: string;
  time_expires?: string;
  listing_type?: string;
  amount?: string;
  // Additional properties for GOAT
  price_cents?: string;
  consigned?: boolean;
  created_at?: string;
  updated_at?: string;
  activated_at?: string;
  defects?: any[];
  additional_defects?: string;
}

export interface GoatListingsProps {
  listings: GoatListing[];
  isLoading: boolean;
  lastUpdated: string;
  filterBySize: string;
}

export const GoatListings: React.FC<GoatListingsProps> = ({ listings, lastUpdated, filterBySize, isLoading }) => {
  const filteredListings = filterBySize 
    ? listings.filter(listing => listing.size.toString() === filterBySize)
    : listings;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span>GOAT Listings</span>
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
                <TableHead>Condition</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredListings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium">
                    {formatCurrency(listing.price || listing.price_cents || listing.amount || '0')}
                  </TableCell>
                  <TableCell>{listing.condition}</TableCell>
                  <TableCell>
                    <Badge variant={listing.status.toLowerCase().includes('active') ? 'default' : 'secondary'}>
                      {listing.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {(listing.createdAt || listing.created_at) ? 
                      new Date(listing.createdAt || listing.created_at || '').toLocaleDateString() : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No GOAT listings found
          </div>
        )}
      </CardContent>
    </Card>
  );
};
