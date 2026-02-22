import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@apollo/client';
import {
  Briefcase, CarFront, HeartPulse, PiggyBank, ShoppingCart, Ticket,
  Wrench, Utensils, PawPrint, House, Gift, Dumbbell, BookOpen,
  Luggage, Mailbox, ReceiptText,
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORY_COLORS } from '@/components/categories/category-tag';
import { CREATE_CATEGORY, UPDATE_CATEGORY } from '@/graphql/mutations';
import { GET_CATEGORIES } from '@/graphql/queries';
import type { LucideIcon } from 'lucide-react';

const ICON_OPTIONS: { name: string; Icon: LucideIcon }[] = [
  { name: 'briefcase', Icon: Briefcase },
  { name: 'car', Icon: CarFront },
  { name: 'health', Icon: HeartPulse },
  { name: 'piggy-bank', Icon: PiggyBank },
  { name: 'shopping', Icon: ShoppingCart },
  { name: 'ticket', Icon: Ticket },
  { name: 'tools', Icon: Wrench },
  { name: 'food', Icon: Utensils },
  { name: 'pet', Icon: PawPrint },
  { name: 'home', Icon: House },
  { name: 'gift', Icon: Gift },
  { name: 'gym', Icon: Dumbbell },
  { name: 'education', Icon: BookOpen },
  { name: 'travel', Icon: Luggage },
  { name: 'mail', Icon: Mailbox },
  { name: 'bills', Icon: ReceiptText },
];

export { ICON_OPTIONS };

const categorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.enum(['INCOME', 'EXPENSE'], { required_error: 'Tipo é obrigatório' }),
  icon: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface Category {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
  type: 'INCOME' | 'EXPENSE';
}

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
}

export function CategoryForm({ open, onOpenChange, category }: CategoryFormProps) {
  const isEditing = !!category;

  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
  });

  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
  });

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: undefined,
      icon: null,
      color: null,
    },
  });

  const selectedIcon = watch('icon');
  const selectedColor = watch('color');

  useEffect(() => {
    if (open) {
      if (category) {
        reset({ name: category.name, type: category.type, icon: category.icon, color: category.color });
      } else {
        reset({ name: '', type: undefined, icon: null, color: null });
      }
    }
  }, [open, category, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (isEditing && category) {
        await updateCategory({
          variables: { id: category.id, input: { name: data.name, type: data.type, color: data.color || null, icon: data.icon || null } },
        });
      } else {
        await createCategory({
          variables: { input: { name: data.name, type: data.type, color: data.color || null, icon: data.icon || null } },
        });
      }
      onOpenChange(false);
    } catch (err) {
      // Error handled by Apollo Client
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[448px] p-6 gap-6">
        {/* Header */}
        <div className="flex flex-col gap-0.5">
          <h2 className="text-base font-semibold leading-6 text-gray-800">
            {isEditing ? 'Editar categoria' : 'Nova categoria'}
          </h2>
          <p className="text-sm text-gray-600">
            Organize suas transações com categorias
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Nome */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="cat-name" className={errors.name ? 'text-danger' : 'text-gray-700'}>
              Nome
            </Label>
            <input
              id="cat-name"
              placeholder="Nome da categoria"
              className="w-full h-12 px-3 border border-gray-300 rounded-lg text-base text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-base focus:border-transparent"
              {...register('name')}
            />
            {errors.name && <p className="text-danger text-xs">{errors.name.message}</p>}
          </div>

          {/* Tipo */}
          <div className="flex flex-col gap-2">
            <Label className={errors.type ? 'text-danger' : 'text-gray-700'}>Tipo</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-12 rounded-lg border-gray-300">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INCOME">Receita</SelectItem>
                    <SelectItem value="EXPENSE">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && <p className="text-danger text-xs">{errors.type.message}</p>}
            <p className="text-xs text-gray-500">Define se a categoria é de receita ou despesa</p>
          </div>

          {/* Ícone */}
          <div className="flex flex-col gap-2">
            <Label className="text-gray-700">Ícone</Label>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map(({ name, Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setValue('icon', selectedIcon === name ? null : name)}
                  className={`flex items-center justify-center h-[42px] w-[42px] rounded-lg border transition-colors ${
                    selectedIcon === name
                      ? 'bg-gray-100 border-brand-base'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      selectedIcon === name ? 'text-gray-600' : 'text-gray-500'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Cor */}
          <div className="flex flex-col gap-2">
            <Label className="text-gray-700">Cor</Label>
            <div className="flex gap-2">
              {CATEGORY_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setValue('color', selectedColor === c.value ? null : c.value)}
                  className={`flex-1 h-[30px] flex items-center justify-center p-1 rounded-lg border transition-colors ${
                    selectedColor === c.value
                      ? 'bg-gray-100 border-brand-base'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div
                    className="w-full h-5 rounded"
                    style={{ backgroundColor: c.value }}
                  />
                </button>
              ))}
            </div>
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
