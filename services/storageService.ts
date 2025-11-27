import { Product, Field, Movement, MovementType } from '../types';
import { INITIAL_PRODUCTS, INITIAL_FIELDS } from './mockData';

const KEYS = {
  PRODUCTS: 'agri_products',
  FIELDS: 'agri_fields',
  MOVEMENTS: 'agri_movements'
};

// --- Initialization ---
export const initializeData = () => {
  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(KEYS.FIELDS)) {
    localStorage.setItem(KEYS.FIELDS, JSON.stringify(INITIAL_FIELDS));
  }
  if (!localStorage.getItem(KEYS.MOVEMENTS)) {
    localStorage.setItem(KEYS.MOVEMENTS, JSON.stringify([]));
  }
};

// --- Getters ---
export const getProducts = (): Product[] => {
  return JSON.parse(localStorage.getItem(KEYS.PRODUCTS) || '[]');
};

export const getFields = (): Field[] => {
  return JSON.parse(localStorage.getItem(KEYS.FIELDS) || '[]');
};

export const getMovements = (): Movement[] => {
  return JSON.parse(localStorage.getItem(KEYS.MOVEMENTS) || '[]');
};

// --- Actions ---

export const addProduct = (product: Product): void => {
  const products = getProducts();
  products.push(product);
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
};

export const registerMovement = (movement: Movement): void => {
  const products = getProducts();
  const productIndex = products.findIndex(p => p.id === movement.productId);

  if (productIndex === -1) throw new Error("Produto não encontrado");

  const product = products[productIndex];

  // Update Stock
  if (movement.type === MovementType.ENTRY) {
    product.currentStock += movement.quantity;
  } else {
    if (product.currentStock < movement.quantity) {
      throw new Error("Estoque insuficiente para esta saída.");
    }
    product.currentStock -= movement.quantity;
  }

  // Save Product Update
  products[productIndex] = product;
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));

  // Save Movement History
  const movements = getMovements();
  movements.unshift(movement); // Add to top
  localStorage.setItem(KEYS.MOVEMENTS, JSON.stringify(movements));

  // Mock Notification System
  mockSendNotification(movement, product.currentStock, product.minStock);
};

// --- Mock Notification ---
const mockSendNotification = (movement: Movement, newStock: number, minStock: number) => {
  console.group('🔔 MOCK NOTIFICATION SYSTEM (WhatsApp/SMS)');
  
  if (movement.type === MovementType.EXIT) {
    console.log(`[MSG] Saída Registrada: ${movement.quantity}${movement.productName} para ${movement.fieldName || 'Geral'}.`);
  } else {
    console.log(`[MSG] Entrada Registrada: +${movement.quantity} em ${movement.productName}.`);
  }

  if (newStock <= minStock) {
    console.warn(`[ALERT] ⚠️ ATENÇÃO: Estoque Crítico! ${movement.productName} está com ${newStock} (Mín: ${minStock}).`);
  }
  
  console.groupEnd();
};
