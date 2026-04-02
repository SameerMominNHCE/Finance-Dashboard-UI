import React from 'react';
import { FileText, FileSpreadsheet } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ExportButton: React.FC = () => {
  const { transactions } = useApp();

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Status'];
    const rows = transactions.map(t => [
      t.date,
      `"${t.description}"`,
      t.category,
      t.type,
      t.amount.toFixed(2),
      t.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finance_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(transactions, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finance_transactions_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={exportToCSV}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
        title="Export as CSV"
      >
        <FileSpreadsheet className="w-4 h-4" />
        <span className="hidden sm:inline">CSV</span>
      </button>
      <button
        onClick={exportToJSON}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
        title="Export as JSON"
      >
        <FileText className="w-4 h-4" />
        <span className="hidden sm:inline">JSON</span>
      </button>
    </div>
  );
};

export default ExportButton;
