'use client';

import { Loader, TriangleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal';
import { useGetWorkspaceInfo } from '@/features/workspaces/api/use-get-workspace-info';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

const WorkspaceIdPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateChannelModal();

  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspaceInfo({ id: workspaceId });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId });

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);

  useEffect(() => {
    if (workspaceLoading || channelsLoading || !workspace) return;

    if (channelId) router.replace(`/workspace/${workspaceId}/channel/${channelId}`);
    else if (!open && !workspace.isMember) setOpen(true);
  }, [channelId, workspaceLoading, channelsLoading, workspace, open, setOpen, router, workspaceId]);

  if (workspaceLoading || channelsLoading) {
    return (
      <div className="h-full flex-1 flex bg-[#5E2C5F]/95 text-white items-center justify-center flex-col gap-2">
        <Loader className="size-5 animate-spin" />
      </div>
    );
  }

  if (!workspaceId || !workspace) {
    return (
      <div className="h-full flex-1 flex bg-[#5E2C5F]/95 text-white items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-5" />
        <span className="text-sm">Workspace not found.</span>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#5E2C5F]/95 text-white flex-1 flex items-center justify-center flex-col gap-2">
      <TriangleAlert className="size-5" />
      <span className="text-sm">No Channel(s) found.</span>
    </div>
  );
};

export default WorkspaceIdPage;
