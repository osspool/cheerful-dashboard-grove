
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { POSCartItem, POSInventoryItem } from '../types';

// Rename POSCartItem to POSOrder for clarity
interface POSOrder extends Omit<POSCartItem, 'id'> {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

interface POSState {
  orders: POSOrder[];
  searchQuery: string;
  selectedPlatform: 'stockx' | 'goat' | 'external';
}

type POSAction = 
  | { type: 'CREATE_ORDER'; payload: POSOrder }
  | { type: 'UPDATE_ORDER'; payload: { id: string; updates: Partial<POSOrder> } }
  | { type: 'DELETE_ORDER'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_PLATFORM'; payload: 'stockx' | 'goat' | 'external' };

const initialState: POSState = {
  orders: [],
  searchQuery: '',
  selectedPlatform: 'stockx',
};

const posReducer = (state: POSState, action: POSAction): POSState => {
  switch (action.type) {
    case 'CREATE_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders], // Add new orders at the top
      };
    
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id
            ? { ...order, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : order
        ),
      };
    
    case 'DELETE_ORDER':
      return {
        ...state,
        orders: state.orders.filter(order => order.id !== action.payload),
      };
    
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };
    
    case 'SET_PLATFORM':
      return {
        ...state,
        selectedPlatform: action.payload,
      };
    
    default:
      return state;
  }
};

const POSContext = createContext<{
  state: POSState;
  dispatch: React.Dispatch<POSAction>;
} | null>(null);

export const POSProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(posReducer, initialState);

  return (
    <POSContext.Provider value={{ state, dispatch }}>
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
