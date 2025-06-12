
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Calendar, Search, Receipt, RotateCcw, FileText, Eye, Truck, Package } from 'lucide-react';
import { usePOSSales } from '../hooks/usePOSSales';
import { POSSaleManagement } from './POSSaleManagement';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

export const POSSalesHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { data: sales, isLoading } = usePOSSales();

  const filteredSales = sales?.filter(sale => {
    const matchesSearch = sale.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !selectedDate || format(new Date(sale.createdAt), 'yyyy-MM-dd') === selectedDate;
    return matchesSearch && matchesDate;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'returned': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'shipped': return <Truck className="h-3 w-3" />;
      case 'delivered': return <Package className="h-3 w-3" />;
      case 'returned': return <RotateCcw className="h-3 w-3" />;
      default: return null;
    }
  };

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const avgSale = filteredSales.length > 0 ? totalSales / filteredSales.length : 0;

  // Status summary
  const statusCounts = filteredSales.reduce((acc, sale) => {
    acc[sale.status] = (acc[sale.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-muted rounded animate-pulse" />
        <div className="h-64 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Sales</span>
            </div>
            <p className="text-2xl font-bold">{filteredSales.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Revenue</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(totalSales)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Avg Sale</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(avgSale)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Pending Ship</span>
            </div>
            <p className="text-2xl font-bold">{statusCounts.confirmed || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(statusCounts).map(([status, count]) => (
              <Badge key={status} className={getStatusColor(status)}>
                {getStatusIcon(status)}
                {status.replace('_', ' ')}: {count}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by sale ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sale ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Adjustments</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-mono">{sale.id}</TableCell>
                  <TableCell>
                    {format(new Date(sale.createdAt), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>{sale.items.length}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(sale.total)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(sale.status)}>
                      {getStatusIcon(sale.status)}
                      {sale.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {sale.adjustments && sale.adjustments.length > 0 ? (
                      <Badge variant="outline" className="text-xs">
                        {sale.adjustments.length} adj.
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                      <SheetTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedSale(sale)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredSales.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No sales found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
