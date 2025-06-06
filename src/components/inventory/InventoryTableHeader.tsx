
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function InventoryTableHeader() {
  return (
    <TableHeader>
      <TableRow className="bg-secondary/20">
        <TableHead className="w-[40px]">
          <Checkbox />
        </TableHead>
        <TableHead className="w-[60px]"></TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Size</TableHead>
        <TableHead>Qty</TableHead>
        <TableHead>Added Date</TableHead>
        <TableHead>Warehouse</TableHead>
        <TableHead>Cost</TableHead>
        <TableHead className="w-[80px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
