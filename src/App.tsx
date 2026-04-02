import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import BalanceTrendChart from './components/BalanceTrendChart';
import SpendingBreakdown from './components/SpendingBreakdown';
import IncomeExpenseChart from './components/IncomeExpenseChart';
import TransactionsTable from './components/TransactionsTable';
import InsightsSection from './components/InsightsSection';
import TransactionModal from './components/TransactionModal';
import ExportButton from './components/ExportButton';

function DashboardContent() {
  const { activeTab, showAddModal, setShowAddModal, editingTransaction, setEditingTransaction, role } = useApp();

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Welcome back! Here's your financial overview.
                </p>
              </div>
              <ExportButton />
            </div>
            <DashboardOverview />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BalanceTrendChart />
              <SpendingBreakdown />
            </div>
            <IncomeExpenseChart />
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  View, search, and manage all your transactions.
                </p>
              </div>
              <ExportButton />
            </div>
            <TransactionsTable />
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Insights</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Understand your spending patterns and financial health.
                </p>
              </div>
              <ExportButton />
            </div>
            <InsightsSection />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © 2024 FinanceFlow. Built with React & Tailwind CSS.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Role:</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                role === 'admin'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {role === 'admin' ? '🔓 Admin' : '👁 Viewer'}
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showAddModal || !!editingTransaction}
        onClose={() => { setShowAddModal(false); setEditingTransaction(null); }}
        editTransaction={editingTransaction}
      />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <DashboardContent />
      </div>
    </AppProvider>
  );
}

export default App;
