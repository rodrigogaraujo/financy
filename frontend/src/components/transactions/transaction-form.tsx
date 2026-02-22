import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@apollo/client';
import { CircleArrowDown, CircleArrowUp, Calendar } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CREATE_TRANSACTION, UPDATE_TRANSACTION } from '@/graphql/mutations';
import { GET_CATEGORIES } from '@/graphql/queries';

const transactionSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  amount: z.number().positive('Valor deve ser positivo'),
  type: z.enum(['INCOME', 'EXPENSE'], { required_error: 'Tipo é obrigatório' }),
  date: z.string().min(1, 'Data é obrigatória'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  color: string | null;
  type: 'INCOME' | 'EXPENSE';
}

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
}

export function TransactionForm({ open, onOpenChange, transaction }: TransactionFormProps) {
  const isEditing = !!transaction;

  const { data: categoriesData } = useQuery<{ categories: Category[] }>(GET_CATEGORIES);

  const [createTransaction, { loading: creating }] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: ['GetTransactions', 'GetTransactionSummary'],
  });

  const [updateTransaction, { loading: updating }] = useMutation(UPDATE_TRANSACTION, {
    refetchQueries: ['GetTransactions', 'GetTransactionSummary'],
  });

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
  });

  const currentType = watch('type');

  useEffect(() => {
    if (open) {
      if (transaction) {
        reset({
          title: transaction.title,
          amount: transaction.amount / 100,
          type: transaction.type,
          date: transaction.date.split('T')[0],
          categoryId: transaction.categoryId,
        });
      } else {
        reset({ title: '', amount: undefined as any, type: 'EXPENSE', date: '', categoryId: '' });
      }
    }
  }, [open, transaction, reset]);

  const onSubmit = async (data: TransactionFormData) => {
    const amountInCents = Math.round(data.amount * 100);
    try {
      if (isEditing && transaction) {
        await updateTransaction({
          variables: { id: transaction.id, input: { ...data, amount: amountInCents } },
        });
      } else {
        await createTransaction({
          variables: { input: { ...data, amount: amountInCents } },
        });
      }
      onOpenChange(false);
    } catch (err) {
      // handled by Apollo
    }
  };

  const categories = categoriesData?.categories || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[448px] p-6 gap-6">
        {/* Header */}
        <div className="flex flex-col gap-0.5">
          <h2 className="text-base font-semibold leading-6 text-gray-800">
            {isEditing ? 'Editar transação' : 'Nova transação'}
          </h2>
          <p className="text-sm text-gray-600">
            Registre sua despesa ou receita
          </p>
        </div>

        {/* Type toggle */}
        <div className="box-border border border-gray-200 rounded-xl p-2 flex gap-0">
          <button
            type="button"
            onClick={() => setValue('type', 'EXPENSE', { shouldValidate: true })}
            className={`flex-1 flex items-center justify-center gap-3 h-[46px] rounded-lg transition-colors ${
              currentType === 'EXPENSE'
                ? 'bg-gray-100 border border-[#DC2626]'
                : 'border border-transparent'
            }`}
          >
            <CircleArrowDown
              className={`h-4 w-4 ${currentType === 'EXPENSE' ? 'text-[#DC2626]' : 'text-gray-400'}`}
            />
            <span
              className={`text-base ${
                currentType === 'EXPENSE'
                  ? 'font-medium text-gray-800'
                  : 'font-normal text-gray-600'
              }`}
            >
              Despesa
            </span>
          </button>
          <button
            type="button"
            onClick={() => setValue('type', 'INCOME', { shouldValidate: true })}
            className={`flex-1 flex items-center justify-center gap-3 h-[46px] rounded-lg transition-colors ${
              currentType === 'INCOME'
                ? 'bg-gray-100 border border-[#16A34A]'
                : 'border border-transparent'
            }`}
          >
            <CircleArrowUp
              className={`h-4 w-4 ${currentType === 'INCOME' ? 'text-[#16A34A]' : 'text-gray-400'}`}
            />
            <span
              className={`text-base ${
                currentType === 'INCOME'
                  ? 'font-medium text-gray-800'
                  : 'font-normal text-gray-600'
              }`}
            >
              Receita
            </span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Descrição */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="title" className={errors.title ? 'text-danger' : 'text-gray-700'}>
              Descrição
            </Label>
            <input
              id="title"
              placeholder="Descrição da transação"
              className="w-full h-12 px-3 border border-gray-300 rounded-lg text-base text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-base focus:border-transparent"
              {...register('title')}
            />
            {errors.title && <p className="text-danger text-xs">{errors.title.message}</p>}
          </div>

          {/* Valor + Data side by side */}
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <Label htmlFor="amount" className={errors.amount ? 'text-danger' : 'text-gray-700'}>
                Valor
              </Label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="R$ 0,00"
                className="w-full h-12 px-3 border border-gray-300 rounded-lg text-base text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-base focus:border-transparent"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && <p className="text-danger text-xs">{errors.amount.message}</p>}
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <Label htmlFor="date" className={errors.date ? 'text-danger' : 'text-gray-700'}>
                Data
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black pointer-events-none" />
                <input
                  id="date"
                  type="date"
                  className="w-full h-12 pl-9 pr-3 border border-gray-300 rounded-lg text-base text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-base focus:border-transparent"
                  {...register('date')}
                />
              </div>
              {errors.date && <p className="text-danger text-xs">{errors.date.message}</p>}
            </div>
          </div>

          {/* Categoria */}
          <div className="flex flex-col gap-2">
            <Label className={errors.categoryId ? 'text-danger' : 'text-gray-700'}>Categoria</Label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-12 rounded-lg border-gray-300">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length === 0 ? (
                      <SelectItem value="_empty" disabled>Crie uma categoria primeiro</SelectItem>
                    ) : (
                      categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && <p className="text-danger text-xs">{errors.categoryId.message}</p>}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={creating || updating}
            className="w-full h-12 rounded-lg bg-brand-base hover:bg-brand-dark text-white text-base font-medium"
          >
            {creating || updating ? 'Salvando...' : 'Salvar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
