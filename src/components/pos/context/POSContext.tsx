
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { POSCartItem, POSInventoryItem } from '../types';

interface POSState {
  cartItems: POSCartItem[];
  searchQuery: string;
  selectedPlatform: 'stockx' | 'goat' | 'external';
}

type POSAction = 
  | { type: 'ADD_TO_CART'; payload: { inventoryItem: POSInventoryItem; platform: 'stockx' | 'goat' | 'external' } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_ITEM'; payload: { id: string; updates: Partial<POSCartItem> } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_PLATFORM'; payload: 'stockx' | 'goat' | 'external' };

const initialState: POSState = {
  cartItems: [],
  searchQuery: '',
  selectedPlatform: 'external',
};

const generateCartItemId = () => `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const posReducer = (state: POSState, action: POSAction): POSState => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const newItem: POSCartItem = {
        id: generateCartItemId(),
        inventoryItem: action.payload.inventoryItem,
        sellingPrice: action.payload.inventoryItem.retail_price,
        costPrice: action.payload.inventoryItem.wholesale_price || action.payload.inventoryItem.retail_price * 0.7,
        platform: action.payload.platform,
        status: 'pending',
        adjustments: [],
      };
      return {
        ...state,
        cartItems: [...state.cartItems, newItem],
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.payload),
      };
    
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.updates }
            : item
        ),
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: [],
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
