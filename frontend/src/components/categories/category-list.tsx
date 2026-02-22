import { useQuery, useMutation } from '@apollo/client';
import { Pencil, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryTag, COLOR_MAP } from '@/components/categories/category-tag';
import { ICON_OPTIONS } from '@/components/categories/category-form';
import { GET_CATEGORIES } from '@/graphql/queries';
import { DELETE_CATEGORY } from '@/graphql/mutations';

interface Category {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
  type: 'INCOME' | 'EXPENSE';
  createdAt: string;
}

interface CategoryListProps {
  onEdit: (category: Category) => void;
  categoryCounts?: Map<string, number>;
}

function getCategoryLightColor(darkColor?: string | null): string {
  if (!darkColor) return '#E5E7EB';
  return COLOR_MAP[darkColor] || '#E5E7EB';
}

export function CategoryList({ onEdit, categoryCounts }: CategoryListProps) {
  const { data, loading } = useQuery<{ categories: Category[] }>(GET_CATEGORIES);
  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta categoria?')) return;
    try {
      await deleteCategory({ variables: { id } });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao deletar categoria');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 animate-pulse">
            <div className="flex justify-between mb-5">
              <div className="h-10 w-10 bg-gray-200 rounded-lg" />
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded-lg" />
                <div className="h-8 w-8 bg-gray-200 rounded-lg" />
              </div>
            </div>
            <div className="h-5 bg-gray-200 rounded w-28 mb-5" />
            <div className="flex justify-between">
              <div className="h-7 bg-gray-200 rounded-full w-20" />
              <div className="h-5 bg-gray-200 rounded w-14" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const categories = data?.categories || [];

  if (categories.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white py-12">
        <p className="text-center text-gray-500">Nenhuma categoria cadastrada</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((category) => {
        const count = categoryCounts?.get(category.id) || 0;

        return (
          <div
            key={category.id}
            className="rounded-xl border border-gray-200 bg-white p-6 flex flex-col gap-5"
          >
            {/* Header: icon + actions */}
            <div className="flex items-start justify-between">
              <div
                className="flex items-center justify-center h-10 w-10 rounded-lg"
                style={{ backgroundColor: getCategoryLightColor(category.color) }}
              >
                {(() => {
                  const iconEntry = category.icon ? ICON_OPTIONS.find((i) => i.name === category.icon) : null;
                  const IconComponent = iconEntry?.Icon || Tag;
                  return (
                    <IconComponent
                      className="h-4 w-4"
                      style={{ color: category.color || '#6B7280' }}
                    />
                  );
                })()}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-gray-300 hover:bg-red-50 hover:text-danger hover:border-danger"
                  onClick={() => handleDelete(category.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-gray-300 hover:bg-gray-200"
                  onClick={() => onEdit(category)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Name */}
            <h3 className="text-base font-semibold leading-6 text-gray-800">
              {category.name}
            </h3>

            {/* Footer: tag + count */}
            <div className="flex items-center justify-between">
              <CategoryTag name={category.name} color={category.color} />
              <span className="text-sm text-gray-600">
                {count} {count === 1 ? 'item' : 'itens'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
