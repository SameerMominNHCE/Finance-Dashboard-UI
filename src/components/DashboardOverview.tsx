import React from 'react';
import { useApp } from '../context/AppContext';
import { calculateSummary, getInsights } from '../utils/financeUtils';
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import SummaryCard from './SummaryCard';

const DashboardOverview: React.FC = () => {
  const { transactions } = useApp();
  const summary = calculateSummary(transactions);
  const insights = getInsights(transactions);

  const expenseTrend = insights.expenseChange;
  const incomeTrend = insights.monthlyData.length >= 2
    ? (() => {
        const current = insights.monthlyData[insights.monthlyData.length - 1];
        const prev = insights.monthlyData[insights.monthlyData.length - 2];
        return prev.income > 0 ? ((current.income - prev.income) / prev.income) * 100 : 0;
      })()
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Balance"
          value={`$${summary.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          trend={{ value: insights.trend > 0 ? (insights.trend / summary.balance) * 100 : 0, positive: insights.trend > 0 }}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <SummaryCard
          title="Total Income"
          value={`$${summary.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={<ArrowUpRight className="w-6 h-6 text-white" />}
          trend={{ value: incomeTrend, positive: incomeTrend > 0 }}
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
        <SummaryCard
          title="Total Expenses"
          value={`$${summary.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={<ArrowDownRight className="w-6 h-6 text-white" />}
          trend={{ value: expenseTrend, positive: expenseTrend < 0 }}
          color="bg-gradient-to-br from-red-500 to-red-600"
        />
        <SummaryCard
          title="Transactions"
          value={summary.transactionCount.toString()}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {/* Recent Transactions Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {transactions.slice(0, 5).map(transaction => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700/50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'income'
                        ? 'bg-emerald-50 dark:bg-emerald-900/30'
                        : 'bg-red-50 dark:bg-red-900/30'
                    }`}>
                      {transaction.type === 'income'
                        ? <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        : <ArrowDownRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                      <p className="text-xs text-gray-400">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      transaction.type === 'income'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Category Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Expense Categories</h3>
          <div className="space-y-3">
            {insights.topCategories.map((cat, index) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">#{index + 1}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{cat.category}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    ${cat.amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Savings Rate</span>
              <span className={`text-sm font-bold ${insights.savingsRate > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {insights.savingsRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
