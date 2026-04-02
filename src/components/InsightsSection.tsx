import React from 'react';
import { useApp } from '../context/AppContext';
import { getInsights, formatCurrency, getCategoryBreakdown } from '../utils/financeUtils';
import { TrendingUp, TrendingDown, PiggyBank, Award, BarChart3, DollarSign } from 'lucide-react';

const InsightsSection: React.FC = () => {
  const { transactions } = useApp();
  const insights = getInsights(transactions);
  const categoryBreakdown = getCategoryBreakdown(transactions);

  const insightCards = [
    {
      icon: <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      title: 'Highest Spending',
      value: insights.highestCategory
        ? `${insights.highestCategory.category} (${insights.highestCategory.percentage.toFixed(0)}%)`
        : 'N/A',
      sub: insights.highestCategory ? formatCurrency(insights.highestCategory.amount) : '',
    },
    {
      icon: <PiggyBank className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      title: 'Savings Rate',
      value: `${insights.savingsRate.toFixed(1)}%`,
      sub: insights.savingsRate > 20 ? 'Great saving habit!' : insights.savingsRate > 0 ? 'Could improve' : 'No savings',
    },
    {
      icon: insights.expenseChange > 0
        ? <TrendingUp className="w-5 h-5 text-red-600 dark:text-red-400" />
        : <TrendingDown className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      bg: insights.expenseChange > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20',
      title: 'Expense Change',
      value: `${insights.expenseChange > 0 ? '+' : ''}${insights.expenseChange.toFixed(1)}%`,
      sub: 'vs previous month',
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      title: 'Avg Monthly Expense',
      value: formatCurrency(insights.avgMonthlyExpense),
      sub: `Over ${insights.monthlyData.length} months`,
    },
  ];

  // Generate observations
  const observations: string[] = [];
  if (insights.savingsRate > 20) {
    observations.push('🎉 Your savings rate is above 20% — excellent financial discipline!');
  } else if (insights.savingsRate > 0) {
    observations.push('💡 Consider reducing expenses in your top spending categories to increase savings.');
  } else {
    observations.push('⚠️ Your expenses exceed income. Review your spending patterns.');
  }

  if (insights.highestCategory && insights.highestCategory.percentage > 30) {
    observations.push(
      `📊 ${insights.highestCategory.category} accounts for ${insights.highestCategory.percentage.toFixed(0)}% of expenses — consider setting a budget.`
    );
  }

  if (insights.trend > 0) {
    observations.push('📈 Your balance is trending upward — keep it up!');
  } else if (insights.trend < 0) {
    observations.push('📉 Your balance decreased recently. Monitor your spending closely.');
  }

  const totalIncome = transactions.filter(t => t.type === 'income').length;
  const totalExpenses = transactions.filter(t => t.type === 'expense').length;
  if (totalExpenses > totalIncome * 2) {
    observations.push(`📝 You have ${totalExpenses} expense transactions vs ${totalIncome} income transactions.`);
  }

  // Top spending categories
  const top3Categories = categoryBreakdown.slice(0, 3);
  const maxCategoryAmount = top3Categories.length > 0 ? top3Categories[0].amount : 1;

  return (
    <div className="space-y-6">
      {/* Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {insightCards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300"
          >
            <div className={`inline-flex p-2.5 rounded-xl ${card.bg} mb-3`}>
              {card.icon}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{card.value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Top Spending Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Spending Categories</h3>
        <div className="space-y-4">
          {top3Categories.map((cat, index) => (
            <div key={cat.category}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">#{index + 1}</span>
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{cat.category}</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatCurrency(cat.amount)}
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${(cat.amount / maxCategoryAmount) * 100}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>
          ))}
          {top3Categories.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No expense data</p>
          )}
        </div>
      </div>

      {/* Observations */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">💡 Smart Insights</h3>
        <div className="space-y-3">
          {observations.map((obs, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
            >
              <DollarSign className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 dark:text-gray-300">{obs}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Comparison Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Monthly Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Month</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Income</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expenses</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Net</th>
              </tr>
            </thead>
            <tbody>
              {insights.monthlyData.map(month => (
                <tr key={month.month} className="border-b border-gray-50 dark:border-gray-700/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{month.month}</td>
                  <td className="px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400 text-right font-medium">
                    {formatCurrency(month.income)}
                  </td>
                  <td className="px-4 py-3 text-sm text-red-600 dark:text-red-400 text-right font-medium">
                    {formatCurrency(month.expenses)}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right font-semibold ${month.income - month.expenses >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatCurrency(month.income - month.expenses)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InsightsSection;
