import React, { useState, useEffect } from 'react';
import { Product, Field, MovementType, Movement } from '../types';
import { ArrowDownCircle, ArrowUpCircle, Calculator, Save, AlertCircle } from 'lucide-react';

interface MovementFormProps {
  products: Product[];
  fields: Field[];
  onSave: (movement: Movement) => void;
}

export const MovementForm: React.FC<MovementFormProps> = ({ products, fields, onSave }) => {
  const [type, setType] = useState<MovementType>(MovementType.EXIT);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedFieldId, setSelectedFieldId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  
  const selectedProduct = products.find(p => p.id === selectedProductId);
  const selectedField = fields.find(f => f.id === selectedFieldId);

  // Auto Calculations
  const dosePerHa = (selectedField && quantity && type === MovementType.EXIT) 
    ? (parseFloat(quantity) / selectedField.hectares).toFixed(2)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !quantity) return;

    const qtyNum = parseFloat(quantity);
    
    // Validation
    if (type === MovementType.EXIT) {
        if (!selectedFieldId) {
            alert("Selecione um talhão para saída.");
            return;
        }
        if (selectedProduct && selectedProduct.currentStock < qtyNum) {
            alert("Estoque insuficiente!");
            return;
        }
    }

    const newMovement: Movement = {
      id: Date.now().toString(),
      type,
      productId: selectedProductId,
      productName: selectedProduct?.name || 'Unknown',
      quantity: qtyNum,
      date: new Date().toISOString(),
      ...(type === MovementType.EXIT && {
        fieldId: selectedFieldId,
        fieldName: selectedField?.name,
        calculatedDosePerHa: dosePerHa ? parseFloat(dosePerHa) : 0
      })
    };

    onSave(newMovement);
    
    // Reset form partially
    setQuantity('');
    setSelectedProductId('');
    // Keep Field selected for convenience
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
        {type === MovementType.EXIT ? <ArrowUpCircle className="text-red-500 mr-2" /> : <ArrowDownCircle className="text-green-500 mr-2" />}
        Registrar Movimentação
      </h2>

      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => setType(MovementType.EXIT)}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            type === MovementType.EXIT 
              ? 'bg-red-500 text-white shadow-md' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          Saída (Aplicação)
        </button>
        <button
          type="button"
          onClick={() => setType(MovementType.ENTRY)}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            type === MovementType.ENTRY 
              ? 'bg-green-600 text-white shadow-md' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          Entrada (Compra)
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            required
          >
            <option value="">Selecione o produto...</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.currentStock} {p.unit} disp.)
              </option>
            ))}
          </select>
          {selectedProduct && (
              <p className="text-xs text-gray-500 mt-1">
                  Lote: {selectedProduct.batch} | Validade: {new Date(selectedProduct.expiryDate).toLocaleDateString()}
              </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
             {/* Quantity */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade ({selectedProduct?.unit || 'Un'})</label>
            <input
                type="number"
                step="0.01"
                min="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="0.00"
                required
            />
            </div>
            
            {/* Field Select (Only for Exit) */}
            {type === MovementType.EXIT && (
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Talhão de Destino</label>
                <select
                    value={selectedFieldId}
                    onChange={(e) => setSelectedFieldId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    required={type === MovementType.EXIT}
                >
                    <option value="">Selecione...</option>
                    {fields.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.hectares} ha)</option>
                    ))}
                </select>
                </div>
            )}
        </div>

        {/* Real-time Calculation Card */}
        {type === MovementType.EXIT && selectedField && quantity && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-3">
                <Calculator className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                <div>
                    <p className="text-sm font-semibold text-blue-900">Cálculo de Consumo</p>
                    <p className="text-sm text-blue-800">
                        Aplicando <strong>{quantity} {selectedProduct?.unit}</strong> em <strong>{selectedField.hectares} ha</strong>.
                    </p>
                    <p className="text-lg font-bold text-blue-700 mt-1">
                        {dosePerHa} {selectedProduct?.unit} / ha
                    </p>
                </div>
            </div>
        )}

        {/* Warning if stock is low after this operation */}
        {type === MovementType.EXIT && selectedProduct && quantity && (selectedProduct.currentStock - parseFloat(quantity) < selectedProduct.minStock) && (
             <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 flex items-center gap-2 text-yellow-800 text-sm">
                 <AlertCircle size={16} />
                 <span>Atenção: Esta saída deixará o estoque abaixo do mínimo.</span>
             </div>
        )}

        <button
          type="submit"
          className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Save size={18} />
          Confirmar {type === MovementType.EXIT ? 'Aplicação' : 'Entrada'}
        </button>
      </form>
    </div>
  );
};