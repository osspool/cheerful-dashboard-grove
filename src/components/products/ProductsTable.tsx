
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  brand: string;
  styleId: string;
  totalVariants: number;
  totalInventory: number;
  platforms: string[];
  productAttributes: {
    color?: string;
    gender?: string;
    category?: string;
    retailPrice?: number;
  };
}

interface ProductsTableProps {
  products: Product[];
  onViewProduct: (productId: string) => void;
}

export function ProductsTable({ products, onViewProduct }: ProductsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Style ID</TableHead>
            <TableHead>Variants</TableHead>
            <TableHead>Total Stock</TableHead>
            <TableHead>Platforms</TableHead>
            <TableHead>Retail Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{product.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {product.productAttributes.color} • {product.productAttributes.category}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{product.brand}</Badge>
              </TableCell>
              <TableCell className="font-mono text-sm">{product.styleId}</TableCell>
              <TableCell>{product.totalVariants} sizes</TableCell>
              <TableCell>
                <span className="font-semibold">{product.totalInventory}</span> units
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {product.platforms.map((platform) => (
                    <Badge key={platform} variant="secondary" className="text-xs">
                      {platform.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>${product.productAttributes.retailPrice}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewProduct(product.id)}
                  className="gap-1"
                >
                  <Eye size={14} />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
