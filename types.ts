export enum Category {
  HERBICIDA = 'Herbicida',
  FUNGICIDA = 'Fungicida',
  INSETICIDA = 'Inseticida',
  FOLIAR = 'Foliar',
  ADJUVANTE = 'Adjuvante',
  REGULADOR = 'Regulador'
}

export enum Unit {
  LITROS = 'L',
  KG = 'Kg'
}

export enum MovementType {
  ENTRY = 'ENTRADA',
  EXIT = 'SAIDA'
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  batch: string; // Lote
  expiryDate: string; // ISO Date
  unit: Unit;
  currentStock: number;
  minStock: number;
}

export interface Field { // Talhão
  id: string;
  name: string;
  hectares: number;
}

export interface Movement {
  id: string;
  type: MovementType;
  productId: string;
  productName: string; // Denormalized for easier display
  quantity: number;
  fieldId?: string; // Only for EXIT
  fieldName?: string; // Denormalized
  date: string; // ISO Date string
  calculatedDosePerHa?: number; // Only for EXIT
}

export interface Alert {
  id: string;
  type: 'CRITICAL_STOCK' | 'EXPIRED' | 'MOVEMENT';
  message: string;
  date: string;
}