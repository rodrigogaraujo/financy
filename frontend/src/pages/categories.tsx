import { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { Plus, Tag as TagIcon, ArrowUpDown } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { CategoryList } from '@/components/categories/category-list';
import { CategoryForm } from '@/components/categories/category-form';
import { GET_CATEGORIES, GET_TRANSACTIONS } from '@/graphql/queries';

interface Category {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
  type: 'INCOME' | 'EXPENSE';
  createdAt: string;
}

interface Transaction {
  id: string;
  categoryId: string;
}

export function CategoriesPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data: catData, loading: catLoading } = useQuery<{ categories: Category[] }>(GET_CATEGORIES);
  const { data: txData } = useQuery<{ transactions: Transaction[] }>(GET_TRANSACTIONS);

  const categories = catData?.categories || [];
  const transactions = txData?.transactions || [];

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const tx of transactions) {
      counts.set(tx.categoryId, (counts.get(tx.categoryId) || 0) + 1);
    }
    return counts;
  }, [transactions]);

  const mostUsedCategory = useMemo(() => {
    let maxCount = 0;
    let name = '-';
    for (const cat of categories) {
      const count = categoryCounts.get(cat.id) || 0;
      if (count > maxCount) {
        maxCount = count;
        name = cat.name;
      }
    }
    return name;
  }, [categories, categoryCounts]);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingCategory(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-4 md:p-12 flex flex-col gap-6 md:gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-2xl font-bold leading-8 text-gray-800">
              Categorias
            </h1>
            <p className="text-base text-gray-600 hidden sm:block">
              Organize suas transações por categorias
            </p>
          </div>
          <Button
            onClick={() => { setEditingCategory(null); setFormOpen(true); }}
            className="rounded-lg bg-brand-base hover:bg-brand-dark text-white h-9 px-3 gap-2 text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nova categoria</span>
            <span className="sm:hidden">Nova</span>
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {catLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="h-6 w-6 bg-gray-200 rounded" />
                  <div className="flex-1">
                    <div className="h-8 bg-gray-200 rounded w-12 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-32" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="rounded-xl border border-gray-200 bg-white p-6 flex items-start gap-4">
                <TagIcon className="h-6 w-6 text-gray-700 shrink-0 mt-1" />
                <div className="flex flex-col gap-2">
                  <span className="text-[28px] font-bold leading-8 text-gray-800">
                    {categories.length}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    total de categorias
                  </span>
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 flex items-start gap-4">
                <ArrowUpDown className="h-6 w-6 text-[#9333EA] shrink-0 mt-1" />
                <div className="flex flex-col gap-2">
                  <span className="text-[28px] font-bold leading-8 text-gray-800">
                    {transactions.length}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    total de transações
                  </span>
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 flex items-start gap-4">
                <TagIcon className="h-6 w-6 text-[#2563EB] shrink-0 mt-1" />
                <div className="flex flex-col gap-2">
                  <span className="text-[28px] font-bold leading-8 text-gray-800">
                    {mostUsedCategory}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    categoria mais utilizada
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Category grid */}
        <CategoryList onEdit={handleEdit} categoryCounts={categoryCounts} />

        <CategoryForm
          open={formOpen}
          onOpenChange={handleOpenChange}
          category={editingCategory}
        />
      </main>
    </div>
  );
}
