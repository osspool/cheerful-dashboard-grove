
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Search, Receipt, RotateCcw, FileText } from 'lucide-react';
import { usePOSSales } from '../hooks/usePOSSales';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

export const POSSalesHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const { data: sales, isLoading } = usePOSSales();

  const filteredSales = sales?.filter(sale => {
    const matchesSearch = sale.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !selectedDate || format(new Date(sale.createdAt), 'yyyy-MM-dd') === selectedDate;
    return matchesSearch && matchesDate;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'returned': return 'bg-red-100 text-red-800';
      case 'partially_returned': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const avgSale = filteredSales.length > 0 ? totalSales / filteredSales.length : 0;

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>

      {/* Filters */}
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

          {/* Sales Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sale ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
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
                      {sale.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Receipt className="h-4 w-4" />
                      </Button>
                      {sale.status === 'completed' && (
                        <Button variant="ghost" size="sm">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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
