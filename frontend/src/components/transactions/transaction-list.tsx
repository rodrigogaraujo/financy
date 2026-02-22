import { useQuery, useMutation } from '@apollo/client';
import { Pencil, Trash2, Tag, CircleArrowUp, CircleArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryTag, COLOR_MAP } from '@/components/categories/category-tag';
import { GET_TRANSACTIONS } from '@/graphql/queries';
import { DELETE_TRANSACTION } from '@/graphql/mutations';
import { formatCurrency, formatDate } from '@/lib/utils';

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

export interface TransactionFilters {
  search?: string;
  type?: string;
  categoryId?: string;
}

interface TransactionListProps {
  onEdit: (transaction: Transaction) => void;
  limit?: number;
  filters?: TransactionFilters;
}

function getCategoryLightColor(darkColor?: string | null): string {
  if (!darkColor) return '#E5E7EB';
  return COLOR_MAP[darkColor] || '#E5E7EB';
}

function buildFilterVariables(filters?: TransactionFilters) {
  if (!filters) return undefined;
  const f: Record<string, string> = {};
  if (filters.search) f.search = filters.search;
  if (filters.type) f.type = filters.type;
  if (filters.categoryId) f.categoryId = filters.categoryId;
  return Object.keys(f).length > 0 ? { filters: f } : undefined;
}

export function TransactionList({ onEdit, limit, filters }: TransactionListProps) {
  const variables = buildFilterVariables(filters);
  const { data, loading } = useQuery<{ transactions: Transaction[] }>(GET_TRANSACTIONS, { variables });
  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: ['GetTransactions', 'GetTransactionSummary'],
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta transação?')) return;
    try {
      await deleteTransaction({ variables: { id } });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao deletar transação');
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[72px] animate-pulse flex items-center gap-4 px-6 border-b border-gray-200">
            <div className="h-10 w-10 bg-gray-200 rounded-lg shrink-0" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-40 mb-2" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-16" />
            <div className="h-6 bg-gray-200 rounded-full w-20" />
            <div className="h-4 bg-gray-200 rounded w-16" />
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  let transactions = data?.transactions || [];

  if (limit) {
    transactions = transactions.slice(0, limit);
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white py-12">
        <p className="text-center text-gray-500">
          {filters?.search || filters?.type || filters?.categoryId
            ? 'Nenhuma transação encontrada'
            : 'Nenhuma transação cadastrada'}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-5 px-6 text-xs font-medium uppercase tracking-wider text-gray-500">
              Descrição
            </th>
            <th className="text-center py-5 px-6 text-xs font-medium uppercase tracking-wider text-gray-500 w-[112px]">
              Data
            </th>
            <th className="text-center py-5 px-6 text-xs font-medium uppercase tracking-wider text-gray-500 w-[200px]">
              Categoria
            </th>
            <th className="text-center py-5 px-6 text-xs font-medium uppercase tracking-wider text-gray-500 w-[136px]">
              Tipo
            </th>
            <th className="text-right py-5 px-6 text-xs font-medium uppercase tracking-wider text-gray-500 w-[200px]">
              Valor
            </th>
            <th className="text-right py-5 px-6 text-xs font-medium uppercase tracking-wider text-gray-500 w-[120px]">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b border-gray-200 h-[72px]">
              {/* Descrição — icon + title */}
              <td className="px-6">
                <div className="flex items-center gap-4">
                  <div
                    className="flex shrink-0 items-center justify-center h-10 w-10 rounded-lg"
                    style={{ backgroundColor: getCategoryLightColor(tx.category?.color) }}
                  >
                    <Tag
                      className="h-4 w-4"
                      style={{ color: tx.category?.color || '#6B7280' }}
                    />
                  </div>
                  <span className="text-base font-medium text-gray-800 truncate">
                    {tx.title}
                  </span>
                </div>
              </td>

              {/* Data */}
              <td className="px-6 text-center text-sm text-gray-600">
                {formatDate(tx.date)}
              </td>

              {/* Categoria */}
              <td className="px-6 text-center">
                {tx.category && (
                  <CategoryTag name={tx.category.name} color={tx.category.color} />
                )}
              </td>

              {/* Tipo */}
              <td className="px-6">
                <div className="flex items-center justify-center gap-2">
                  {tx.type === 'INCOME' ? (
                    <>
                      <CircleArrowUp className="h-4 w-4 text-[#16A34A]" />
                      <span className="text-sm font-medium text-[#15803D]">Entrada</span>
                    </>
                  ) : (
                    <>
                      <CircleArrowDown className="h-4 w-4 text-[#DC2626]" />
                      <span className="text-sm font-medium text-[#B91C1C]">Saída</span>
                    </>
                  )}
                </div>
              </td>

              {/* Valor */}
              <td className="px-6 text-right text-sm font-semibold text-gray-800">
                {tx.type === 'INCOME' ? '+' : '-'} {formatCurrency(tx.amount)}
              </td>

              {/* Ações — trash first, edit second (Figma order) */}
              <td className="px-6">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-gray-300 hover:bg-red-50 hover:text-danger hover:border-danger"
                    onClick={() => handleDelete(tx.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-gray-300 hover:bg-gray-200"
                    onClick={() => onEdit(tx)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
