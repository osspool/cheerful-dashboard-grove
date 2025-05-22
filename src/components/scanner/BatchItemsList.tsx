
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BatchItem } from './ScannerContent';

interface BatchItemsListProps {
  items: BatchItem[];
  isProcessing: boolean;
}

export const BatchItemsList = ({ items, isProcessing }: BatchItemsListProps) => {
  if (items.length === 0) {
    return (
      <Card className="flex-grow">
        <CardHeader>
          <CardTitle>Scanned Items</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48 text-muted-foreground">
          No items have been scanned yet
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex-grow">
      <CardHeader className="pb-3">
        <CardTitle>Scanned Items ({items.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-auto max-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">UPC</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right w-[80px]">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.upcCode}>
                  <TableCell className="font-mono text-xs">{item.upcCode}</TableCell>
                  <TableCell>
                    {item.isNewProduct ? (
                      <span className="flex items-center">
                        <span className="h-2 w-2 bg-yellow-500 rounded-full mr-2"></span>
                        New/Unidentified Product
                      </span>
                    ) : (
                      item.productName
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.brand && !item.isNewProduct
                      ? `${item.brand}${item.color ? ` | ${item.color}` : ''}${
                          item.size ? ` | Size ${item.size}` : ''
                        }`
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right font-medium">{item.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
