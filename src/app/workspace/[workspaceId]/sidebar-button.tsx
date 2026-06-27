import type { LucideIcon } from 'lucide-react';
import type { IconType } from 'react-icons/lib';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarButtonProps {
  icon: LucideIcon | IconType;
  label: string;
  isActive?: boolean;
  unreadCount?: number;
}

export const SidebarButton = ({ icon: Icon, label, isActive = false, unreadCount }: SidebarButtonProps) => {
  return (
    <div className="group flex cursor-pointer flex-col items-center justify-center gap-y-0.5">
      <div className="relative">
        <Button variant="transparent" className={cn('size-9 p-2 group-hover:bg-white/20', isActive && 'bg-white/20')}>
          <Icon className="size-5 text-white transition-all group-hover:scale-110" />
        </Button>

        {!!unreadCount && unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 py-0.5 text-[10px] font-bold leading-none text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>

      <span className="text-[11px] text-white group-hover:text-white/70">{label}</span>
    </div>
  );
};
