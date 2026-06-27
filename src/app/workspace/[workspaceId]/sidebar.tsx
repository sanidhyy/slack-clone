'use client';

import { Bell, Home, MessagesSquare, MoreHorizontal } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { UserButton } from '@/features/auth/components/user-button';
import { useGetUnreadCount } from '@/features/messages/api/use-get-unread-count';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { SidebarButton } from './sidebar-button';
import { WorkspaceSwitcher } from './workspace-switcher';

export const Sidebar = () => {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();

  const { data: unreadCount } = useGetUnreadCount({ workspaceId });

  return (
    <aside className="flex h-full w-[70px] flex-col items-center gap-y-4 bg-[var(--sidebar)] pb-[4px] pt-[9px]">
      <WorkspaceSwitcher />

      <SidebarButton icon={Home} label="Home" isActive={pathname.includes('/workspace')} />
      <SidebarButton icon={MessagesSquare} label="DMs" />
      <SidebarButton icon={Bell} label="Activity" unreadCount={unreadCount ?? 0} />
      <SidebarButton icon={MoreHorizontal} label="More" />

      <div className="mt-auto flex flex-col items-center justify-center gap-y-1">
        <UserButton />
      </div>
    </aside>
  );
};
