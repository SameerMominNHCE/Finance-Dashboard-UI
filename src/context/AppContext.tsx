import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Transaction, UserRole, FilterState } from '../types';
import { mockTransactions } from '../data/mockData';

interface AppState {
  transactions: Transaction[];
  role: UserRole;
  filters: FilterState;
  darkMode: boolean;
  showAddModal: boolean;
  editingTransaction: Transaction | null;
  activeTab: 'dashboard' | 'transactions' | 'insights';
}

interface AppContextType extends AppState {
  setRole: (role: UserRole) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  toggleDarkMode: () => void;
  setShowAddModal: (show: boolean) => void;
  setEditingTransaction: (transaction: Transaction | null) => void;
  setActiveTab: (tab: 'dashboard' | 'transactions' | 'insights') => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  filteredTransactions: Transaction[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultFilters: FilterState = {
  search: '',
  type: 'all',
  category: 'all',
  dateRange: null,
  sortBy: 'date',
  sortOrder: 'desc',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('finance_transactions');
    return saved ? JSON.parse(saved) : mockTransactions;
  });

  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('finance_role') as UserRole) || 'viewer';
  });

  const [filters, setFiltersState] = useState<FilterState>(defaultFilters);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('finance_darkMode') === 'true';
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'insights'>('dashboard');

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('finance_darkMode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const setFilters = useCallback((partial: Partial<FilterState>) => {
    setFiltersState(prev => ({ ...prev, ...partial }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  }, []);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const filteredTransactions = React.useMemo(() => {
    let result = [...transactions];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(t =>
        t.description.toLowerCase().includes(search) ||
        t.category.toLowerCase().includes(search)
      );
    }

    if (filters.type !== 'all') {
      result = result.filter(t => t.type === filters.type);
    }

    if (filters.category !== 'all') {
      result = result.filter(t => t.category === filters.category);
    }

    if (filters.dateRange) {
      result = result.filter(t =>
        t.date >= filters.dateRange!.start && t.date <= filters.dateRange!.end
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (filters.sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (filters.sortBy === 'amount') {
        comparison = a.amount - b.amount;
      } else if (filters.sortBy === 'category') {
        comparison = a.category.localeCompare(b.category);
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [transactions, filters]);

  return (
    <AppContext.Provider
      value={{
        transactions,
        role,
        filters,
        darkMode,
        showAddModal,
        editingTransaction,
        activeTab,
        setRole,
        setFilters,
        toggleDarkMode,
        setShowAddModal,
        setEditingTransaction,
        setActiveTab,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        filteredTransactions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
