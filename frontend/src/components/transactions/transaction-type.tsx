import { CircleArrowUp, CircleArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionTypeProps {
  type: 'INCOME' | 'EXPENSE';
  className?: string;
}

export function TransactionTypeIndicator({ type, className }: TransactionTypeProps) {
  const isIncome = type === 'INCOME';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {isIncome ? (
        <CircleArrowUp className="h-5 w-5 text-income-base" />
      ) : (
        <CircleArrowDown className="h-5 w-5 text-expense-base" />
      )}
      <span
        className={cn(
          'text-sm font-medium',
          isIncome ? 'text-income-dark' : 'text-expense-dark',
        )}
      >
        {isIncome ? 'Entrada' : 'Saída'}
      </span>
    </div>
  );
}
