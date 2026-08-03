import { cn, getInitials, avatarColor } from '@/utils';

interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  ring?: boolean;
}

const sizes = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

export function Avatar({ name, size = 'md', className, ring }: AvatarProps) {
  const bg = avatarColor(name);
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white',
        sizes[size],
        ring && 'ring-2 ring-[var(--bg-surface)]',
        className,
      )}
      style={{ backgroundColor: bg }}
      title={name}
    >
      {getInitials(name)}
    </span>
  );
}
