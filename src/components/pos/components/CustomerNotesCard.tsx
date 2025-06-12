
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { POSSale } from '../types';

interface CustomerNotesCardProps {
  sale: POSSale;
}

export const CustomerNotesCard = ({ sale }: CustomerNotesCardProps) => {
  if (!sale.customerNotes) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Customer Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{sale.customerNotes}</p>
      </CardContent>
    </Card>
  );
};
