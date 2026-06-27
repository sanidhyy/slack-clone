'use client';

import { AlertTriangle, HashIcon, Loader } from 'lucide-react';

import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useNewDmModal } from '@/features/members/store/use-new-dm-modal';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useChannelId } from '@/hooks/use-channel-id';
import { useMemberId } from '@/hooks/use-member-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { SidebarItem } from './sidebar-item';
import { UserItem } from './user-item';
import { WorkspaceHeader } from './workspace-header';
import { WorkspaceSection } from './workspace-section';

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const memberId = useMemberId();

  const [_open, setOpen] = useCreateChannelModal();
  const [_dmOpen, setDmOpen] = useNewDmModal();

  const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId });
  const { data: members, isLoading: membersLoading } = useGetMembers({ workspaceId });

  if (memberLoading || workspaceLoading || channelsLoading || membersLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[var(--workspace-sidebar)]">
        <Loader className="size-5 animate-spin text-[var(--workspace-sidebar-fg)]" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-y-2 bg-[var(--workspace-sidebar)]">
        <AlertTriangle className="size-5 text-[var(--workspace-sidebar-fg)]" />
        <p className="text-sm text-[var(--workspace-sidebar-fg)]">Workspace not found.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-y-2 bg-[var(--workspace-sidebar)]">
      <WorkspaceHeader workspace={workspace} isAdmin={member.role === 'admin'} />

      {channels && channels.length !== 0 && (
        <WorkspaceSection label="Channels" hint="New Channel" onNew={member.role === 'admin' ? () => setOpen(true) : undefined}>
          {channels?.map((item) => (
            <SidebarItem
              variant={channelId === item._id ? 'active' : 'default'}
              key={item._id}
              id={item._id}
              icon={HashIcon}
              label={item.name}
            />
          ))}
        </WorkspaceSection>
      )}

      {members && members.length !== 0 && (
        <WorkspaceSection label="Direct Messages" hint="New Direct Message" onNew={() => setDmOpen(true)}>
          {members?.map((item) => (
            <UserItem
              key={item._id}
              id={item._id}
              label={item.user.name}
              image={item.user.image}
              variant={item._id === memberId ? 'active' : 'default'}
            />
          ))}
        </WorkspaceSection>
      )}
    </div>
  );
};
