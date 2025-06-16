
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ClipboardList, Edit, Trash2, Save, X, Package } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { formatCurrency } from '@/lib/utils';
import { POSCartItem } from '../types';
import { useToast } from '@/hooks/use-toast';

interface POSOrder extends Omit<POSCartItem, 'id'> {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

export const POSOrderManagement = () => {
  const { state, dispatch } = usePOS();
  const { toast } = useToast();
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    sellingPrice: string;
    status: POSCartItem['status'];
    notes: string;
  }>({ sellingPrice: '', status: 'pending', notes: '' });

  const handleEditOrder = (order: POSOrder) => {
    setEditingOrder(order.id);
    setEditData({
      sellingPrice: order.sellingPrice.toString(),
      status: order.status,
      notes: order.notes || '',
    });
  };

  const handleSaveOrder = () => {
    if (!editingOrder) return;

    dispatch({
      type: 'UPDATE_ORDER',
      payload: {
        id: editingOrder,
        updates: {
          sellingPrice: parseFloat(editData.sellingPrice),
          status: editData.status,
          notes: editData.notes,
        },
      },
    });

    toast({
      title: "Order Updated",
      description: "Order has been successfully updated.",
    });

    setEditingOrder(null);
  };

  const handleDeleteOrder = (orderId: string) => {
    dispatch({ type: 'DELETE_ORDER', payload: orderId });
    toast({
      title: "Order Deleted",
      description: "Order has been successfully deleted.",
    });
  };

  const getStatusColor = (status: POSCartItem['status']) => {
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

  const getDisplaySize = (variant: any) => {
    if (variant?.stockx?.variantValue) {
      return variant.stockx.variantValue;
    }
    if (variant?.goat?.size) {
      return `${variant.goat.size}${variant.goat.size_unit === 'SIZE_UNIT_US' ? ' US' : ''}`;
    }
    if (variant?.general?.size) {
      return `${variant.general.size} ${variant.general.size_unit || ''}`.trim();
    }
    return 'One Size';
  };

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Recent Orders ({state.orders.length})
        </CardTitle>
      </CardHeader>

      <div className="flex-1 overflow-y-auto px-6">
        {state.orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No orders created yet</p>
            <p className="text-sm">Create your first order by selecting a product</p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.orders.map((order) => (
              <Card key={order.id} className="border-l-4 border-l-primary/20">
                <CardContent className="p-4">
                  {editingOrder === order.id ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-sm">{order.inventoryItem.product.title}</h4>
                          <p className="text-xs text-muted-foreground">{order.inventoryItem.product.brand}</p>
                          <p className="text-xs text-muted-foreground">Size: {getDisplaySize(order.inventoryItem.variant)}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSaveOrder}
                            className="h-8 w-8 p-0 text-green-600"
                          >
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingOrder(null)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Selling Price</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={editData.sellingPrice}
                            onChange={(e) => setEditData({ ...editData, sellingPrice: e.target.value })}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Status</Label>
                          <Select value={editData.status} onValueChange={(value: POSCartItem['status']) => setEditData({ ...editData, status: value })}>
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="returned">Returned</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs">Notes</Label>
                        <Textarea
                          value={editData.notes}
                          onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                          placeholder="Order notes..."
                          rows={2}
                          className="text-xs"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{order.inventoryItem.product.title}</h4>
                          <p className="text-xs text-muted-foreground">{order.inventoryItem.product.brand}</p>
                          <p className="text-xs text-muted-foreground">Size: {getDisplaySize(order.inventoryItem.variant)}</p>
                          <p className="text-xs text-muted-foreground">Order: {order.id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditOrder(order)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteOrder(order.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Platform:</span>
                          <span className="capitalize font-medium">{order.platform}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Selling Price:</span>
                          <span className="font-medium">{formatCurrency(order.sellingPrice)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Cost:</span>
                          <span>{formatCurrency(order.costPrice)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Profit:</span>
                          <span className={order.sellingPrice - order.costPrice >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(order.sellingPrice - order.costPrice)}
                          </span>
                        </div>
                        {order.notes && (
                          <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
                            {order.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
