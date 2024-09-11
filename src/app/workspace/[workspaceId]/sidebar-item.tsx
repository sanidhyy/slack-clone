import { type VariantProps, cva } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import type { IconType } from 'react-icons/lib';

import type { Id } from '@/../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { cn } from '@/lib/utils';

const sidebarItemVariants = cva('flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden', {
  variants: {
    variant: {
      default: 'text-[#f9EDFFCC]',
      active: 'text-[#481349] bg-white/90 hover:bg-white/90',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface SidebarItemProps {
  id: string;
  icon: LucideIcon | IconType;
  label: Id<'channels'> | string;
  variant?: VariantProps<typeof sidebarItemVariants>['variant'];
}

export const SidebarItem = ({ id, icon: Icon, label, variant }: SidebarItemProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <Button variant="transparent" size="sm" className={cn(sidebarItemVariants({ variant }))} asChild>
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className="size-3.5 mr-1 shrink-0" />
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};
