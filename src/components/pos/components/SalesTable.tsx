
import React, { useState } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { POSSale } from '../types';
import { POSSaleManagement } from './POSSaleManagement';
import { SalesTableRow } from './SalesTableRow';

interface SalesTableProps {
  sales: POSSale[];
}

export const SalesTable = ({ sales }: SalesTableProps) => {
  const [selectedSale, setSelectedSale] = useState<POSSale | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleViewSale = (sale: POSSale) => {
    setSelectedSale(sale);
    setIsSheetOpen(true);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sale ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Profit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Adjustments</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <SalesTableRow 
              key={sale.id} 
              sale={sale} 
              onViewSale={handleViewSale}
            />
          ))}
        </TableBody>
      </Table>

      {sales.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No sales found matching your criteria.
        </div>
      )}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <div style={{ display: 'none' }} />
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Sale Management - {selectedSale?.id}</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {selectedSale && (
              <POSSaleManagement 
                sale={selectedSale} 
                onUpdate={() => setIsSheetOpen(false)}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
