import { Product, Field, Category, Unit } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Glifosato Premium',
    category: Category.HERBICIDA,
    batch: 'L-2023-001',
    expiryDate: '2025-12-31',
    unit: Unit.LITROS,
    currentStock: 500,
    minStock: 100
  },
  {
    id: '2',
    name: 'Ciproconazol Top',
    category: Category.FUNGICIDA,
    batch: 'F-2023-099',
    expiryDate: '2024-11-20',
    unit: Unit.LITROS,
    currentStock: 45,
    minStock: 50 // This should trigger low stock alert
  },
  {
    id: '3',
    name: 'Imidacloprido Force',
    category: Category.INSETICIDA,
    batch: 'I-2024-010',
    expiryDate: '2026-05-15',
    unit: Unit.KG,
    currentStock: 200,
    minStock: 20
  },
  {
    id: '4',
    name: 'Aminasol Foliar',
    category: Category.FOLIAR,
    batch: 'FO-2023-55',
    expiryDate: '2024-08-01',
    unit: Unit.LITROS,
    currentStock: 1200,
    minStock: 200
  },
  {
    id: '5',
    name: 'Óleo Mineral Assist',
    category: Category.ADJUVANTE,
    batch: 'AD-2024-001',
    expiryDate: '2027-01-01',
    unit: Unit.LITROS,
    currentStock: 300,
    minStock: 50
  }
];

export const INITIAL_FIELDS: Field[] = [
  { id: '101', name: 'Talhão 01 - Sede', hectares: 50 },
  { id: '102', name: 'Talhão 02 - Rio', hectares: 120 },
  { id: '103', name: 'Talhão 03 - Mata', hectares: 85 },
  { id: '104', name: 'Talhão 04 - Fundo', hectares: 200 },
];