
import { InventoryItem } from '../inventory-drawer/types';

// Sample inventory data - each item represents one UPC with one variant
export const sampleInventoryItems: InventoryItem[] = [
  {
    id: "inv_001",
    upc: "123456789012",
    name: "Air Jordan 1 Retro High OG 'Chicago'",
    styleId: "555088-101", 
    brand: "Jordan",
    image: "/placeholder.svg",
    size: "10",
    quantity: 2,
    dateAdded: "2024-01-15",
    warehouseLocation: "A1-B2",
    cost: "170",
    retailPrice: 170,
    productAttributes: {
      color: "White/Black-Varsity Red",
      gender: "Men",
      category: "Basketball",
      retailPrice: 170,
      releaseDate: "2022-11-05",
      season: null,
      colorway: "Chicago",
      _id: "attr_001"
    },
    stockx: {
      sku: "555088-101",
      productId: "air-jordan-1-retro-high-og-chicago"
    },
    goat: {
      sku: "555088-101", 
      catalogId: "12345",
      name: "Air Jordan 1 Retro High OG Chicago"
    },
    platformsAvailable: ['stockx', 'goat'],
    inventoryAddedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "inv_002", 
    upc: "123456789013",
    name: "Air Jordan 1 Retro High OG 'Chicago'",
    styleId: "555088-101",
    brand: "Jordan", 
    image: "/placeholder.svg",
    size: "9.5",
    quantity: 1,
    dateAdded: "2024-01-16",
    warehouseLocation: "A1-B3", 
    cost: "170",
    retailPrice: 170,
    productAttributes: {
      color: "White/Black-Varsity Red",
      gender: "Men", 
      category: "Basketball",
      retailPrice: 170,
      releaseDate: "2022-11-05",
      season: null,
      colorway: "Chicago",
      _id: "attr_001"
    },
    stockx: {
      sku: "555088-101",
      productId: "air-jordan-1-retro-high-og-chicago"
    },
    goat: {
      sku: "555088-101",
      catalogId: "12345", 
      name: "Air Jordan 1 Retro High OG Chicago"
    },
    platformsAvailable: ['stockx', 'goat'],
    inventoryAddedAt: "2024-01-16T14:20:00Z"
  },
  {
    id: "inv_003",
    upc: "123456789014", 
    name: "Nike Dunk Low 'Panda'",
    styleId: "DD1391-100",
    brand: "Nike",
    image: "/placeholder.svg", 
    size: "11",
    quantity: 3,
    dateAdded: "2024-01-20",
    warehouseLocation: "B2-C1",
    cost: "110", 
    retailPrice: 110,
    productAttributes: {
      color: "White/Black",
      gender: "Men",
      category: "Lifestyle", 
      retailPrice: 110,
      releaseDate: "2021-03-10",
      season: null,
      colorway: "Panda", 
      _id: "attr_002"
    },
    stockx: {
      sku: "DD1391-100",
      productId: "nike-dunk-low-panda"
    },
    goat: {
      sku: "DD1391-100",
      catalogId: "54321",
      name: "Nike Dunk Low Panda"
    },
    platformsAvailable: ['stockx', 'goat'],
    inventoryAddedAt: "2024-01-20T09:15:00Z"
  }
];
