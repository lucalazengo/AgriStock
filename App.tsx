import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Package, ArrowLeftRight, Leaf, Menu, X, Bell } from 'lucide-react';
import { initializeData, getProducts, getFields, getMovements, addProduct, registerMovement } from './services/storageService';
import { Product, Field, Movement } from './types';

// Components
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { MovementForm } from './components/MovementForm';

// Initialize mock data
initializeData();

enum View {
  DASHBOARD = 'dashboard',
  INVENTORY = 'inventory',
  MOVEMENTS = 'movements'
}

function App() {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // App State
  const [products, setProducts] = useState<Product[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [lastUpdated, setLastUpdated] = useState(Date.now()); // Trigger re-renders

  // Load Data
  useEffect(() => {
    setProducts(getProducts());
    setFields(getFields());
    setMovements(getMovements());
  }, [lastUpdated]);

  const refreshData = () => setLastUpdated(Date.now());

  const handleAddProduct = (p: Product) => {
    addProduct(p);
    refreshData();
    showToast("Produto cadastrado com sucesso!");
  };

  const handleMovement = (m: Movement) => {
    try {
      registerMovement(m);
      refreshData();
      showToast("Movimentação registrada com sucesso!");
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Simple Toast Mock
  const showToast = (msg: string) => {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce';
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View, icon: any, label: string }) => (
    <button
      onClick={() => { setCurrentView(view); setIsSidebarOpen(false); }}
      className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
        currentView === view ? 'bg-green-100 text-green-800 font-semibold' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-green-700">
            <Leaf size={28} />
            <span className="text-xl font-bold tracking-tight">AgriStock</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <NavItem view={View.DASHBOARD} icon={LayoutDashboard} label="Visão Geral" />
          <NavItem view={View.INVENTORY} icon={Package} label="Produtos" />
          <NavItem view={View.MOVEMENTS} icon={ArrowLeftRight} label="Movimentações" />
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 text-gray-500 text-sm">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
              AG
            </div>
            <div>
              <p className="font-medium text-gray-900">Admin Fazenda</p>
              <p className="text-xs">Versão 1.0.0</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-gray-600">
            <Menu size={24} />
          </button>
          
          <h1 className="text-lg font-semibold text-gray-800 ml-4 md:ml-0">
            {currentView === View.DASHBOARD && 'Dashboard Gerencial'}
            {currentView === View.INVENTORY && 'Controle de Estoque'}
            {currentView === View.MOVEMENTS && 'Registro de Entrada/Saída'}
          </h1>

          <div className="flex items-center space-x-4">
             <button className="relative text-gray-500 hover:text-gray-700">
                 <Bell size={20} />
                 {products.some(p => p.currentStock <= p.minStock) && (
                     <span className="absolute top-0 right-0 block w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                 )}
             </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            
            {currentView === View.DASHBOARD && (
              <Dashboard products={products} />
            )}

            {currentView === View.INVENTORY && (
              <Inventory products={products} onAddProduct={handleAddProduct} />
            )}

            {currentView === View.MOVEMENTS && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2">
                    <MovementForm products={products} fields={fields} onSave={handleMovement} />
                 </div>
                 
                 {/* Recent Movements Log */}
                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit">
                    <h3 className="font-semibold text-gray-700 mb-4">Últimas Movimentações</h3>
                    <div className="space-y-4">
                        {movements.slice(0, 5).map((m, idx) => (
                            <div key={idx} className="flex justify-between items-start text-sm pb-3 border-b border-gray-50 last:border-0">
                                <div>
                                    <p className="font-medium text-gray-900">{m.productName}</p>
                                    <p className="text-gray-500">
                                        {m.type === 'SAIDA' ? `Aplicado em ${m.fieldName}` : 'Compra/Entrada'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(m.date).toLocaleString()}</p>
                                </div>
                                <div className={`font-bold ${m.type === 'SAIDA' ? 'text-red-600' : 'text-green-600'}`}>
                                    {m.type === 'SAIDA' ? '-' : '+'}{m.quantity}
                                </div>
                            </div>
                        ))}
                        {movements.length === 0 && <p className="text-gray-400 text-center py-4">Sem histórico.</p>}
                    </div>
                 </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;