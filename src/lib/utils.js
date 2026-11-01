import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes, resolving conflicts (shadcn/ui convention).
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
