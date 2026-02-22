import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { ChevronRight, Plus, CircleArrowUp, CircleArrowDown, Tag } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { CategoryTag, COLOR_MAP } from '@/components/categories/category-tag';
import { GET_TRANSACTIONS, GET_CATEGORIES } from '@/graphql/queries';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  categoryId: string;
  category: { id: string; name: string; color: string | null } | null;
}

interface Category {
  id: string;
  name: string;
  color: string | null;
  type: 'INCOME' | 'EXPENSE';
}

function getCategoryLightColor(darkColor?: string | null): string {
  if (!darkColor) return '#E5E7EB';
  return COLOR_MAP[darkColor] || '#E5E7EB';
}

export function DashboardPage() {
  const [formOpen, setFormOpen] = useState(false);
  const { data: txData, loading: txLoading } = useQuery<{ transactions: Transaction[] }>(GET_TRANSACTIONS);
  const { data: catData, loading: catLoading } = useQuery<{ categories: Category[] }>(GET_CATEGORIES);

  const transactions = txData?.transactions || [];
  const categories = catData?.categories || [];
  const recentTransactions = transactions.slice(0, 5);

  const categorySummary = useMemo(() => {
    const txByCategory = new Map<string, { count: number; total: number }>();

    for (const tx of transactions) {
      const existing = txByCategory.get(tx.categoryId) || { count: 0, total: 0 };
      existing.count++;
      existing.total += tx.amount;
      txByCategory.set(tx.categoryId, existing);
    }

    return categories
      .map((cat) => ({
        ...cat,
        count: txByCategory.get(cat.id)?.count ?? 0,
        total: txByCategory.get(cat.id)?.total ?? 0,
      }))
      .filter((cat) => cat.count > 0)
      .sort((a, b) => b.total - a.total);
  }, [transactions, categories]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-4 md:p-12 flex flex-col gap-4 md:gap-6">
        <SummaryCards />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {/* Left — Transações recentes (spans 2 of 3 columns on desktop) */}
          <section className="sm:col-span-2 rounded-xl border border-gray-200 bg-white flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 md:px-6 py-4 md:py-5 border-b border-gray-200">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Transações recentes
              </span>
              <Link
                to="/transactions"
                className="flex items-center gap-1 text-sm font-medium text-brand-base hover:underline"
              >
                Ver todas
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Body */}
            <div className="flex flex-col">
              {txLoading ? (
                <div className="p-4 md:p-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 md:h-20 animate-pulse flex items-center gap-4 px-4 md:px-6 border-b border-gray-200">
                      <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-40 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentTransactions.length === 0 ? (
                <p className="text-center text-gray-500 py-10">Nenhuma transação cadastrada</p>
              ) : (
                recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center border-b border-gray-200 min-h-16 md:h-20 py-3 md:py-0">
                    {/* Icon + Title + Date */}
                    <div className="flex items-center gap-3 md:gap-4 px-4 md:px-6 flex-1 min-w-0">
                      <div
                        className="flex shrink-0 items-center justify-center h-10 w-10 rounded-lg"
                        style={{ backgroundColor: getCategoryLightColor(tx.category?.color) }}
                      >
                        <Tag
                          className="h-4 w-4"
                          style={{ color: tx.category?.color || '#6B7280' }}
                        />
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-sm md:text-base font-medium text-gray-800 truncate">
                          {tx.title}
                        </span>
                        <span className="text-xs md:text-sm text-gray-600">{formatDate(tx.date)}</span>
                      </div>
                    </div>

                    {/* Category tag — hidden on mobile */}
                    <div className="hidden md:flex items-center justify-center px-6 w-40 shrink-0">
                      {tx.category && (
                        <CategoryTag name={tx.category.name} color={tx.category.color} />
                      )}
                    </div>

                    {/* Amount + type icon */}
                    <div className="flex items-center justify-end gap-2 px-4 md:px-6 w-auto md:w-40 shrink-0">
                      <span className="text-xs md:text-sm font-semibold text-gray-800 whitespace-nowrap">
                        {tx.type === 'INCOME' ? '+' : '-'} {formatCurrency(tx.amount)}
                      </span>
                      {tx.type === 'INCOME' ? (
                        <CircleArrowUp className="h-4 w-4 text-brand-base" />
                      ) : (
                        <CircleArrowDown className="h-4 w-4 text-[#DC2626]" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer — New transaction */}
            <div className="flex items-center justify-center px-4 md:px-6 py-4 md:py-5">
              <button
                type="button"
                onClick={() => setFormOpen(true)}
                className="flex items-center gap-1 text-sm font-medium text-brand-base hover:underline"
              >
                <Plus className="h-5 w-5" />
                Nova transação
              </button>
            </div>
          </section>

          {/* Right — Categorias (1 column on desktop, aligns with 3rd card) */}
          <section className="sm:col-span-1 rounded-xl border border-gray-200 bg-white flex flex-col self-start">
            {/* Header */}
            <div className="flex items-center justify-between px-4 md:px-6 py-4 md:py-5 border-b border-gray-200">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Categorias
              </span>
              <Link
                to="/categories"
                className="flex items-center gap-1 text-sm font-medium text-brand-base hover:underline"
              >
                Ver todas
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-4 md:gap-5 p-4 md:p-6">
              {catLoading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="h-7 animate-pulse flex items-center gap-2">
                    <div className="h-7 w-24 bg-gray-200 rounded-full" />
                    <div className="h-4 bg-gray-200 rounded w-12 flex-1" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </div>
                ))
              ) : categorySummary.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Nenhuma categoria com transações</p>
              ) : (
                categorySummary.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-1">
                    <CategoryTag name={cat.name} color={cat.color} />
                    <span className="text-sm text-gray-600 flex-1">
                      {cat.count} {cat.count === 1 ? 'item' : 'itens'}
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {formatCurrency(cat.total)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      <TransactionForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}
