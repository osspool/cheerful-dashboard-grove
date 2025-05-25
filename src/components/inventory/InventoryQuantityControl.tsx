
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from 'lucide-react';
import { useUpdateInventoryQuantity } from '@/hooks/use-inventory-data';

interface InventoryQuantityControlProps {
  initialQuantity: number;
  variantId: string;
  onQuantityChange?: (variantId: string, newQuantity: number) => void;
  itemId?: string;
}

export function InventoryQuantityControl({
  initialQuantity,
  variantId,
  onQuantityChange,
  itemId = '1' // Default to first item if not provided
}: InventoryQuantityControlProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const updateQuantity = useUpdateInventoryQuantity();

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      handleUpdateQuantity(newQuantity);
    }
  };

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    handleUpdateQuantity(newQuantity);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
      handleUpdateQuantity(value);
    }
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    // Call the legacy handler if provided (for backwards compatibility)
    if (onQuantityChange) {
      onQuantityChange(variantId, newQuantity);
    }
    
    // Use our new React Query mutation - only pass itemId and newQuantity
    updateQuantity.mutate({ itemId, newQuantity });
  };

  return (
    <div className="flex items-center border rounded-md">
      <Button 
        type="button"
        variant="ghost" 
        size="icon"
        className="h-8 w-8 rounded-r-none border-r"
        onClick={handleDecrease}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <Input 
        type="number" 
        value={quantity} 
        onChange={handleChange}
        className="h-8 w-12 text-center border-none text-xs" 
      />
      <Button 
        type="button"
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 rounded-l-none border-l"
        onClick={handleIncrease}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}
