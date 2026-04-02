import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { getMonthlyData, formatCurrency } from '../utils/financeUtils';

const IncomeExpenseChart: React.FC = () => {
  const { transactions, darkMode } = useApp();
  const monthlyData = getMonthlyData(transactions);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Income vs Expenses</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Monthly comparison</p>
      </div>

      {monthlyData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-400">
          <p>No data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkMode ? '#374151' : '#F3F4F6'}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                color: darkMode ? '#FFFFFF' : '#111827',
              }}
              formatter={(value) => formatCurrency(Number(value))}
            />
            <Legend
              wrapperStyle={{ paddingTop: '16px' }}
              iconType="circle"
            />
            <Bar
              dataKey="income"
              fill="#10B981"
              radius={[6, 6, 0, 0]}
              name="Income"
            />
            <Bar
              dataKey="expenses"
              fill="#EF4444"
              radius={[6, 6, 0, 0]}
              name="Expenses"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default IncomeExpenseChart;
