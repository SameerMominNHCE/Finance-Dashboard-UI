import { Transaction, MonthlyData, CategoryBreakdown } from '../types';
import { categoryColors } from '../data/mockData';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function getMonthYear(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export function calculateSummary(transactions: Transaction[]) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    transactionCount: transactions.length,
  };
}

export function getMonthlyData(transactions: Transaction[]): MonthlyData[] {
  const monthlyMap = new Map<string, { income: number; expenses: number }>();

  transactions.forEach(t => {
    const month = getMonthYear(t.date);
    if (!monthlyMap.has(month)) {
      monthlyMap.set(month, { income: 0, expenses: 0 });
    }
    const data = monthlyMap.get(month)!;
    if (t.type === 'income') {
      data.income += t.amount;
    } else {
      data.expenses += t.amount;
    }
  });

  const months = Array.from(monthlyMap.entries())
    .sort((a, b) => {
      const dateA = new Date(a[0] + ' 1');
      const dateB = new Date(b[0] + ' 1');
      return dateA.getTime() - dateB.getTime();
    });

  let runningBalance = 0;
  return months.map(([month, data]) => {
    runningBalance += data.income - data.expenses;
    return {
      month,
      income: data.income,
      expenses: data.expenses,
      balance: runningBalance,
    };
  });
}

export function getCategoryBreakdown(transactions: Transaction[]): CategoryBreakdown[] {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  const categoryMap = new Map<string, number>();
  expenseTransactions.forEach(t => {
    categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
  });

  return Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category: category as CategoryBreakdown['category'],
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      color: categoryColors[category] || '#A3A3A3',
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function getInsights(transactions: Transaction[]) {
  const summary = calculateSummary(transactions);
  const categoryBreakdown = getCategoryBreakdown(transactions);
  const monthlyData = getMonthlyData(transactions);

  // Highest spending category
  const highestCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0] : null;

  // Savings rate
  const savingsRate = summary.totalIncome > 0
    ? ((summary.totalIncome - summary.totalExpenses) / summary.totalIncome) * 100
    : 0;

  // Average monthly expense
  const avgMonthlyExpense = monthlyData.length > 0
    ? monthlyData.reduce((sum, m) => sum + m.expenses, 0) / monthlyData.length
    : 0;

  // Monthly comparison
  const lastMonth = monthlyData.length > 0 ? monthlyData[monthlyData.length - 1] : null;
  const prevMonth = monthlyData.length > 1 ? monthlyData[monthlyData.length - 2] : null;
  const expenseChange = lastMonth && prevMonth && prevMonth.expenses > 0
    ? ((lastMonth.expenses - prevMonth.expenses) / prevMonth.expenses) * 100
    : 0;

  // Top 3 expense categories
  const topCategories = categoryBreakdown.slice(0, 3);

  // Income vs Expense trend
  const trend = monthlyData.length >= 2
    ? monthlyData[monthlyData.length - 1].balance - monthlyData[monthlyData.length - 2].balance
    : 0;

  return {
    highestCategory,
    savingsRate,
    avgMonthlyExpense,
    expenseChange,
    topCategories,
    trend,
    monthlyData,
  };
}
