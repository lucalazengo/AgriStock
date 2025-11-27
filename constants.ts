import { Category } from './types';

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.HERBICIDA]: 'bg-red-100 text-red-800 border-red-200',
  [Category.FUNGICIDA]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [Category.INSETICIDA]: 'bg-orange-100 text-orange-800 border-orange-200',
  [Category.FOLIAR]: 'bg-green-100 text-green-800 border-green-200',
  [Category.ADJUVANTE]: 'bg-blue-100 text-blue-800 border-blue-200',
  [Category.REGULADOR]: 'bg-purple-100 text-purple-800 border-purple-200',
};

export const CATEGORY_CHART_COLORS: Record<Category, string> = {
  [Category.HERBICIDA]: '#ef4444',
  [Category.FUNGICIDA]: '#eab308',
  [Category.INSETICIDA]: '#f97316',
  [Category.FOLIAR]: '#22c55e',
  [Category.ADJUVANTE]: '#3b82f6',
  [Category.REGULADOR]: '#a855f7',
};