import React, { useMemo } from 'react';
import { Product, Category } from '../types';
import { CATEGORY_CHART_COLORS, CATEGORY_COLORS } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { AlertTriangle, Droplet, Package, TrendingDown } from 'lucide-react';

interface DashboardProps {
  products: Product[];
}

export const Dashboard: React.FC<DashboardProps> = ({ products }) => {
  
  const stats = useMemo(() => {
    let totalItems = 0;
    let lowStockCount = 0;
    let expiredCount = 0;
    const categoryData: Record<string, number> = {};

    const today = new Date();

    products.forEach(p => {
      totalItems += p.currentStock;
      
      // Category Aggregation
      if (!categoryData[p.category]) categoryData[p.category] = 0;
      categoryData[p.category] += p.currentStock;

      // Alerts
      if (p.currentStock <= p.minStock) lowStockCount++;
      if (new Date(p.expiryDate) < today) expiredCount++;
    });

    const chartData = Object.keys(categoryData).map(key => ({
      name: key,
      value: categoryData[key]
    }));

    return { totalItems, lowStockCount, expiredCount, chartData };
  }, [products]);

  const lowStockProducts = products.filter(p => p.currentStock <= p.minStock);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Geral</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Produtos Cadastrados</p>
            <p className="text-2xl font-bold text-gray-800">{products.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-full">
            <Droplet size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Volume Total (Mix)</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalItems.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className={`p-3 rounded-full ${stats.lowStockCount > 0 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'}`}>
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Estoque Baixo</p>
            <p className={`text-2xl font-bold ${stats.lowStockCount > 0 ? 'text-red-600' : 'text-gray-800'}`}>
              {stats.lowStockCount}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className={`p-3 rounded-full ${stats.expiredCount > 0 ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-400'}`}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Vencidos</p>
            <p className={`text-2xl font-bold ${stats.expiredCount > 0 ? 'text-orange-600' : 'text-gray-800'}`}>
              {stats.expiredCount}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Distribution Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Distribuição por Categoria</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_CHART_COLORS[entry.name as Category] || '#ccc'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {stats.chartData.map((d) => (
              <div key={d.name} className="flex items-center text-xs text-gray-600">
                <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: CATEGORY_CHART_COLORS[d.name as Category] }}></span>
                {d.name}
              </div>
            ))}
          </div>
        </div>

        {/* Critical Alerts List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Alertas de Reposição</h3>
          {lowStockProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <Package size={48} className="mb-2 opacity-50" />
              <p>Nenhum produto em nível crítico.</p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-64 space-y-3">
              {lowStockProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg">
                  <div>
                    <p className="font-medium text-red-900">{p.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[p.category]}`}>
                      {p.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-red-700">{p.currentStock} <span className="text-xs font-normal">{p.unit}</span></p>
                    <p className="text-xs text-red-500">Mínimo: {p.minStock}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};