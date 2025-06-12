
import React from 'react';
import { POSSale } from '../types';
import { SaleOverviewCard } from './SaleOverviewCard';
import { StatusManagementCard } from './StatusManagementCard';
import { AdjustmentsCard } from './AdjustmentsCard';
import { CustomerNotesCard } from './CustomerNotesCard';

interface POSSaleManagementProps {
  sale: POSSale;
  onUpdate?: () => void;
}

export const POSSaleManagement = ({ sale, onUpdate }: POSSaleManagementProps) => {
  return (
    <div className="space-y-6">
      <SaleOverviewCard sale={sale} />
      <StatusManagementCard sale={sale} onUpdate={onUpdate} />
      <AdjustmentsCard sale={sale} onUpdate={onUpdate} />
      <CustomerNotesCard sale={sale} />
    </div>
  );
};
