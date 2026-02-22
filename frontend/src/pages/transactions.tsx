import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Plus, Search, ChevronDown } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { TransactionList } from '@/components/transactions/transaction-list';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { GET_CATEGORIES } from '@/graphql/queries';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  categoryId: string;
  category: { id: string; name: string; color: string | null } | null;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  color: string | null;
  type: 'INCOME' | 'EXPENSE';
}

export function TransactionsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const { data: catData } = useQuery<{ categories: Category[] }>(GET_CATEGORIES);
  const categories = catData?.categories || [];

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingTransaction(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-4 md:p-12 flex flex-col gap-6 md:gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-2xl font-bold leading-8 text-gray-800">
              Transações
            </h1>
            <p className="text-base text-gray-600 hidden sm:block">
              Gerencie todas as suas transações financeiras
            </p>
          </div>
          <Button
            onClick={() => { setEditingTransaction(null); setFormOpen(true); }}
            className="rounded-lg bg-brand-base hover:bg-brand-dark text-white h-9 px-3 gap-2 text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nova transação</span>
            <span className="sm:hidden">Nova</span>
          </Button>
        </div>

        {/* Filters */}
        <section className="rounded-xl border border-gray-200 bg-white px-4 md:px-6 pt-5 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Descrição</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquise por descrição"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-12 pl-9 pr-3 border border-gray-300 rounded-lg text-base text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-base focus:border-transparent"
                />
              </div>
            </div>

            {/* Type */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Tipo</label>
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full h-12 appearance-none px-3 pr-9 border border-gray-300 rounded-lg text-base text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-base focus:border-transparent"
                >
                  <option value="">Todos</option>
                  <option value="INCOME">Entrada</option>
                  <option value="EXPENSE">Saída</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-700 pointer-events-none" />
              </div>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Categoria</label>
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full h-12 appearance-none px-3 pr-9 border border-gray-300 rounded-lg text-base text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-base focus:border-transparent"
                >
                  <option value="">Todas</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-700 pointer-events-none" />
              </div>
            </div>

            {/* Date */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Data</label>
              <div className="relative">
                <select
                  className="w-full h-12 appearance-none px-3 pr-9 border border-gray-300 rounded-lg text-base text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-base focus:border-transparent"
                  defaultValue=""
                >
                  <option value="">Todas</option>
                  <option value="7d">Últimos 7 dias</option>
                  <option value="30d">Últimos 30 dias</option>
                  <option value="90d">Últimos 90 dias</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-700 pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Table */}
        <TransactionList
          onEdit={handleEdit}
          filters={{ search, type: typeFilter, categoryId: categoryFilter }}
        />

        <TransactionForm
          open={formOpen}
          onOpenChange={handleOpenChange}
          transaction={editingTransaction}
        />
      </main>
    </div>
  );
}
