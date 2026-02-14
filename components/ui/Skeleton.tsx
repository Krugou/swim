import { cn } from '@/lib/utils';

const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('animate-pulse rounded-md bg-muted/50 border-2 border-transparent', className)}
    {...props}
  />
);

export { Skeleton };
