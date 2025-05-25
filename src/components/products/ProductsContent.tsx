
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye } from 'lucide-react';
import { ProductsTable } from './ProductsTable';
import { useNavigate } from 'react-router-dom';

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

// Mock products data
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Air Jordan 1 Retro High OG "Bred Toe"',
    brand: 'Jordan',
    styleId: 'AJ1-BRED-TOE',
    totalVariants: 12,
    totalInventory: 45,
    platforms: ['stockx', 'goat'],
    productAttributes: {
      color: 'Black/Red/White',
      gender: 'Men',
      category: 'Basketball',
      retailPrice: 170
    }
  },
  {
    id: '2',
    title: 'Nike Dunk Low "Panda"',
    brand: 'Nike',
    styleId: 'DD1391-100',
    totalVariants: 15,
    totalInventory: 28,
    platforms: ['stockx', 'goat'],
    productAttributes: {
      color: 'White/Black',
      gender: 'Unisex',
      category: 'Lifestyle',
      retailPrice: 110
    }
  }
];

export function ProductsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredProducts = mockProducts.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.styleId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewProduct = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Products Catalog</h1>
            <p className="text-muted-foreground">Master product database for distributors</p>
          </div>
          <Button>Add New Product</Button>
        </div>
        
        <div className="bg-card rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">All Products</h2>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search products..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <ProductsTable 
            products={filteredProducts}
            onViewProduct={handleViewProduct}
          />
        </div>
      </div>
    </main>
  );
}
