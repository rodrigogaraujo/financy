import { useQuery } from '@apollo/client';
import { Wallet, CircleArrowUp, CircleArrowDown } from 'lucide-react';
import { GET_TRANSACTION_SUMMARY } from '@/graphql/queries';
import { formatCurrency } from '@/lib/utils';

interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

const cards = [
  { key: 'balance', label: 'Saldo total', icon: Wallet, iconColor: 'text-[#9333EA]' },
  { key: 'income', label: 'Receitas do mês', icon: CircleArrowUp, iconColor: 'text-brand-base' },
  { key: 'expense', label: 'Despesas do mês', icon: CircleArrowDown, iconColor: 'text-[#DC2626]' },
] as const;

export function SummaryCards() {
  const { data, loading } = useQuery<{ transactionSummary: TransactionSummary }>(GET_TRANSACTION_SUMMARY);
  const summary = data?.transactionSummary || { totalIncome: 0, totalExpense: 0, balance: 0 };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 md:p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-28 mb-4" />
            <div className="h-8 bg-gray-200 rounded w-40" />
          </div>
        ))}
      </div>
    );
  }

  const values: Record<string, number> = {
    balance: summary.balance,
    income: summary.totalIncome,
    expense: summary.totalExpense,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
      {cards.map((card) => (
        <div key={card.key} className="rounded-xl border border-gray-200 bg-white p-5 md:p-6 flex flex-col gap-3 md:gap-4">
          <div className="flex items-center gap-3">
            <card.icon className={`h-5 w-5 ${card.iconColor}`} />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              {card.label}
            </span>
          </div>
          <p className="text-2xl md:text-[28px] font-bold leading-8 text-gray-800">
            {formatCurrency(values[card.key] ?? 0)}
          </p>
        </div>
      ))}
    </div>
  );
}
