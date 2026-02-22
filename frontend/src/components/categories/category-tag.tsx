import { cn } from '@/lib/utils';

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  '#DBEAFE': { bg: 'bg-tag-blue-light', text: 'text-tag-blue-dark' },
  '#F3E8FF': { bg: 'bg-tag-purple-light', text: 'text-tag-purple-dark' },
  '#FCE7F3': { bg: 'bg-tag-pink-light', text: 'text-tag-pink-dark' },
  '#FEE2E2': { bg: 'bg-tag-red-light', text: 'text-tag-red-dark' },
  '#FFEDD5': { bg: 'bg-tag-orange-light', text: 'text-tag-orange-dark' },
  '#F7F3CA': { bg: 'bg-tag-yellow-light', text: 'text-tag-yellow-dark' },
  '#E0FAE9': { bg: 'bg-tag-green-light', text: 'text-tag-green-dark' },
  '#E5E7EB': { bg: 'bg-gray-200', text: 'text-gray-700' },
};

// Map dark hex colors to their light bg counterpart for lookup
export const COLOR_MAP: Record<string, string> = {
  '#1D4ED8': '#DBEAFE',
  '#7E22CE': '#F3E8FF',
  '#BE185D': '#FCE7F3',
  '#B91C1C': '#FEE2E2',
  '#C2410C': '#FFEDD5',
  '#A16207': '#F7F3CA',
  '#15803D': '#E0FAE9',
  '#374151': '#E5E7EB',
  // Figma palette
  '#16A34A': '#E0FAE9',
  '#2563EB': '#DBEAFE',
  '#9333EA': '#F3E8FF',
  '#DB2777': '#FCE7F3',
  '#DC2626': '#FEE2E2',
  '#EA580C': '#FFEDD5',
  '#CA8A04': '#F7F3CA',
};

interface CategoryTagProps {
  name: string;
  color?: string | null;
  className?: string;
}

export function CategoryTag({ name, color, className }: CategoryTagProps) {
  const lightColor = color ? (COLOR_MAP[color] || color) : '#E5E7EB';
  const tagStyle = TAG_COLORS[lightColor] ?? { bg: 'bg-gray-200', text: 'text-gray-700' };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium',
        tagStyle.bg,
        tagStyle.text,
        className,
      )}
    >
      {name}
    </span>
  );
}

export const CATEGORY_COLORS = [
  { label: 'Verde', value: '#16A34A', bg: '#E0FAE9' },
  { label: 'Azul', value: '#2563EB', bg: '#DBEAFE' },
  { label: 'Roxo', value: '#9333EA', bg: '#F3E8FF' },
  { label: 'Rosa', value: '#DB2777', bg: '#FCE7F3' },
  { label: 'Vermelho', value: '#DC2626', bg: '#FEE2E2' },
  { label: 'Laranja', value: '#EA580C', bg: '#FFEDD5' },
  { label: 'Amarelo', value: '#CA8A04', bg: '#F7F3CA' },
];
