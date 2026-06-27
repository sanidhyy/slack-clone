'use client';

import { CreateChannelModal } from '@/features/channels/components/create-channel-modal';
import { CreateWorkspaceModal } from '@/features/workspaces/components/create-workspace-modal';

export const ModalProvider = () => {
  return (
    <>
      <CreateChannelModal />
      <CreateWorkspaceModal />
    </>
  );
};
