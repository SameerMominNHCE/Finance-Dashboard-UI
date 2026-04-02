# FinanceFlow - Finance Dashboard

A comprehensive, deployment-ready finance dashboard built with React, TypeScript, and Tailwind CSS. This dashboard allows users to track and understand their financial activity with interactive visualizations, transaction management, and role-based access control.

## 🚀 Live Demo

The dashboard is fully functional and can be deployed directly. All data is persisted in localStorage.

## 📋 Features

### 1. Dashboard Overview
- **Summary Cards**: Total Balance, Income, Expenses, and Transaction Count with trend indicators
- **Balance Trend Chart**: Area chart showing monthly balance progression over time
- **Spending Breakdown**: Interactive donut chart showing expense distribution by category
- **Income vs Expenses**: Bar chart comparing monthly income and expenses
- **Recent Transactions**: Quick view of the latest 5 transactions
- **Top Spending Categories**: Ranked list with visual progress bars

### 2. Transactions Section
- **Full Transaction List**: Date, description, category, amount, type, and status
- **Search**: Filter transactions by description or category name
- **Type Filter**: Filter by Income or Expense
- **Category Filter**: Filter by specific spending category
- **Sorting**: Sort by date, amount, or category (ascending/descending)
- **Empty State**: Graceful handling when no transactions match filters

### 3. Role-Based UI (RBAC Simulation)
- **Viewer Role**: Read-only access — can view all data but cannot modify
- **Admin Role**: Full access — can add, edit, and delete transactions
- **Role Toggle**: Switch between roles using the header toggle
- **Visual Indicator**: Admin mode shows a banner indicating edit capabilities

### 4. Insights Section
- **Highest Spending Category**: Identifies the category with the most spending
- **Savings Rate**: Calculates percentage of income saved
- **Expense Change**: Month-over-month expense comparison
- **Average Monthly Expense**: Running average across all months
- **Smart Observations**: Auto-generated financial insights and recommendations
- **Monthly Comparison Table**: Detailed month-by-month breakdown
- **Top 3 Spending Categories**: Visual bar chart of top expense categories

### 5. State Management
- **React Context API**: Centralized state management
- **Persisted State**: Transactions, role preference, and dark mode saved to localStorage
- **Computed Data**: Filters, summaries, and insights derived from transaction data
- **Clean Architecture**: Separated types, data, context, utilities, and components

### 6. UI/UX Features
- **Dark Mode**: Full dark theme support with smooth transitions
- **Responsive Design**: Works on mobile, tablet, and desktop screens
- **Interactive Charts**: Hover tooltips, animations, and responsive sizing
- **Color-Coded Categories**: Each spending category has a unique color
- **Status Badges**: Visual indicators for completed, pending, and failed transactions
- **Smooth Animations**: Hover effects, transitions, and modal animations

### 7. Export Functionality
- **CSV Export**: Download all transactions as a CSV file
- **JSON Export**: Download all transactions as a JSON file

## 🛠 Tech Stack

- **React 19** — UI library
- **TypeScript** — Type safety
- **Tailwind CSS 4** — Styling
- **Recharts** — Data visualization
- **Lucide React** — Icon library
- **Vite** — Build tool and dev server

## 📁 Project Structure

```
src/
├── App.tsx                    # Main application component
├── main.tsx                   # Entry point
├── index.css                  # Global styles & Tailwind
├── types/
│   └── index.ts              # TypeScript type definitions
├── data/
│   └── mockData.ts           # Mock transaction data
├── context/
│   └── AppContext.tsx        # Global state management
├── utils/
│   └── financeUtils.ts       # Data processing utilities
└── components/
    ├── Header.tsx            # Navigation & role toggle
    ├── SummaryCard.tsx       # Dashboard summary cards
    ├── DashboardOverview.tsx # Main dashboard view
    ├── BalanceTrendChart.tsx # Balance trend area chart
    ├── SpendingBreakdown.tsx # Category donut chart
    ├── IncomeExpenseChart.tsx # Income vs expense bar chart
    ├── TransactionsTable.tsx # Transaction list with filters
    ├── TransactionModal.tsx  # Add/Edit transaction modal
    ├── InsightsSection.tsx   # Financial insights view
    └── ExportButton.tsx      # CSV/JSON export
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The development server runs at `http://localhost:5173` with hot module replacement.

## 📊 Mock Data

The dashboard comes pre-loaded with 72 realistic transactions spanning 6 months (January - June 2024), covering:
- 11 spending categories
- Income (Salary, Freelance, Investments)
- Expenses (Food, Transport, Shopping, Entertainment, Bills, Healthcare, Travel)

## 🎨 Design Decisions

1. **Clean Card-Based Layout**: Information is organized in cards with clear visual hierarchy
2. **Color Coding**: Income (green), Expenses (red), and categories each have distinct colors
3. **Progressive Disclosure**: Dashboard shows overview, Transactions shows details, Insights shows analysis
4. **Mobile-First**: Responsive design adapts from mobile to desktop seamlessly
5. **Dark Mode**: Full dark theme for reduced eye strain and modern aesthetics

## 🔒 Role-Based Access Control

The RBAC is simulated on the frontend:

| Feature              | Viewer            | Admin          |
|----------------------|-------------------|----------------|
| View Dashboard       | ✅                | ✅            |
| View Transactions    | ✅                | ✅            |
| View Insights        | ✅                | ✅            |
| Add Transaction      | ❌                | ✅            |
| Edit Transaction     | ❌                | ✅            |
| Delete Transaction   | ❌                | ✅            |
| Export Data          | ✅                | ✅            |

## 📦 Deployment

The project is configured with `vite-plugin-singlefile` for easy deployment. A GitHub Actions workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds the app and publishes the `dist` folder to GitHub Pages.

If you use GitHub Pages, set the repository Pages source to GitHub Actions so the deployed site serves the production build instead of the raw source files.

```bash
npm run build
```

The output is in `dist/index.html` and can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting

## 📝 License

This project is built for evaluation purposes.
