
import React from 'react';
import { Calendar } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SaleHistoryItem {
  date: string;
  time: string;
  size: string;
  price: string;
}

interface SalesHistoryProps {
  salesData: SaleHistoryItem[];
}

export function SalesHistory({ salesData }: SalesHistoryProps) {
  return (
    <div>
      <div className="mb-2">
        <h3 className="text-lg font-medium flex items-center gap-1">
          <Calendar className="h-4 w-4" /> Sales History
        </h3>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className="text-right">Sale Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesData.map((sale, index) => (
              <TableRow key={index}>
                <TableCell className="text-sm">{sale.date}</TableCell>
                <TableCell className="text-sm">{sale.time}</TableCell>
                <TableCell className="text-sm">{sale.size}</TableCell>
                <TableCell className="text-right font-medium">{sale.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="bg-secondary/10 p-2 text-center">
          <button className="text-primary text-sm hover:underline">
            Load More
          </button>
        </div>
      </div>
    </div>
  );
}
