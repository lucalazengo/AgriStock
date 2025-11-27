import React, { useState } from 'react';
import { Product, Category, Unit } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { Plus, Search, AlertCircle } from 'lucide-react';

interface InventoryProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ products, onAddProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    category: Category.HERBICIDA,
    unit: Unit.LITROS
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.batch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name && newProduct.currentStock !== undefined) {
      onAddProduct({
        ...newProduct,
        id: Date.now().toString(),
        currentStock: Number(newProduct.currentStock),
        minStock: Number(newProduct.minStock),
      } as Product);
      setIsModalOpen(false);
      setNewProduct({ category: Category.HERBICIDA, unit: Unit.LITROS }); // Reset
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">Estoque de Insumos</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-sm transition-colors"
        >
          <Plus size={16} /> Novo Produto
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Buscar por nome ou lote..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      {/* Product List - Mobile Responsive Card Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
             {/* Category Indicator Strip */}
             <div className={`absolute top-0 left-0 w-1.5 h-full ${CATEGORY_COLORS[product.category].split(' ')[0].replace('bg-', 'bg-')}`}></div>
             
             <div className="pl-3">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-semibold text-gray-800">{product.name}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold ${CATEGORY_COLORS[product.category]}`}>
                            {product.category}
                        </span>
                    </div>
                    <div className="text-right">
                        <span className={`block text-xl font-bold ${product.currentStock <= product.minStock ? 'text-red-600' : 'text-gray-800'}`}>
                            {product.currentStock} <small className="text-xs text-gray-500 font-normal">{product.unit}</small>
                        </span>
                    </div>
                </div>
                
                <div className="text-xs text-gray-500 space-y-1 mt-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between">
                        <span>Lote: {product.batch}</span>
                        <span>Val: {new Date(product.expiryDate).toLocaleDateString()}</span>
                    </div>
                    {product.currentStock <= product.minStock && (
                        <div className="flex items-center text-red-500 font-medium pt-1">
                            <AlertCircle size={12} className="mr-1" /> Estoque Crítico (Mín: {product.minStock})
                        </div>
                    )}
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Modal for Add Product */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Novo Produto</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <input required className="w-full border rounded p-2" 
                  value={newProduct.name || ''} 
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Categoria</label>
                    <select className="w-full border rounded p-2"
                        value={newProduct.category}
                        onChange={e => setNewProduct({...newProduct, category: e.target.value as Category})}
                    >
                        {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Unidade</label>
                    <select className="w-full border rounded p-2"
                        value={newProduct.unit}
                        onChange={e => setNewProduct({...newProduct, unit: e.target.value as Unit})}
                    >
                        {Object.values(Unit).map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Lote</label>
                    <input required className="w-full border rounded p-2" 
                      value={newProduct.batch || ''} 
                      onChange={e => setNewProduct({...newProduct, batch: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Validade</label>
                    <input required type="date" className="w-full border rounded p-2" 
                      value={newProduct.expiryDate || ''} 
                      onChange={e => setNewProduct({...newProduct, expiryDate: e.target.value})} 
                    />
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Estoque Inicial</label>
                    <input required type="number" className="w-full border rounded p-2" 
                      value={newProduct.currentStock || ''} 
                      onChange={e => setNewProduct({...newProduct, currentStock: Number(e.target.value)})} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Estoque Mínimo</label>
                    <input required type="number" className="w-full border rounded p-2" 
                      value={newProduct.minStock || ''} 
                      onChange={e => setNewProduct({...newProduct, minStock: Number(e.target.value)})} 
                    />
                  </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};