
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ScanBarcode, Package } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { POSProductGrid } from './POSProductGrid';
import { POSBarcodeScanner } from './POSBarcodeScanner';
import { POSOrderImport } from './POSOrderImport';

export const POSProductSearch = () => {
  const { state, dispatch } = usePOS();
  const [activeTab, setActiveTab] = useState('search');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-card/50">
        <h2 className="text-lg font-semibold mb-4">Add Products to Sale</h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search Products
            </TabsTrigger>
            <TabsTrigger value="scan" className="flex items-center gap-2">
              <ScanBarcode className="h-4 w-4" />
              Scan UPC
            </TabsTrigger>
            <TabsTrigger value="order" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Import Order
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="mt-4">
            <div className="space-y-4">
              <Input
                placeholder="Search by product name, brand, or style ID..."
                value={state.searchQuery}
                onChange={handleSearchChange}
                className="w-full"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="scan" className="mt-4">
            <POSBarcodeScanner />
          </TabsContent>

          <TabsContent value="order" className="mt-4">
            <POSOrderImport />
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'search' ? (
          <POSProductGrid searchQuery={state.searchQuery} />
        ) : activeTab === 'scan' ? (
          <div className="text-center text-muted-foreground py-8">
            Use the scanner above to scan product UPC codes
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Enter platform and order ID above to import order details
          </div>
        )}
      </div>
    </div>
  );
};
