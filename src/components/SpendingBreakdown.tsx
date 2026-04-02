import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { getCategoryBreakdown, formatCurrency } from '../utils/financeUtils';

const SpendingBreakdown: React.FC = () => {
  const { transactions, darkMode } = useApp();
  const breakdown = getCategoryBreakdown(transactions);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Spending Breakdown</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">By category</p>
      </div>

      {breakdown.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-400">
          <p>No expense data available</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="amount"
                  strokeWidth={2}
                  stroke={darkMode ? '#1F2937' : '#FFFFFF'}
                >
                  {breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
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
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto max-h-[250px]">
            {breakdown.map(item => (
              <div key={item.category} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.category}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(item.amount)}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">
                    {item.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpendingBreakdown;
