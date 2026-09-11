'use client';

import { Loader } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { useDefaultLayout } from 'react-resizable-panels';

import type { Id } from '@/../convex/_generated/dataModel';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Profile } from '@/features/members/components/profile';
import { Thread } from '@/features/messages/components/thread';
import { usePanel } from '@/hooks/use-panel';

import { Sidebar } from './sidebar';
import { Toolbar } from './toolbar';
import { WorkspaceSidebar } from './workspace-sidebar';

const WorkspaceIdLayout = ({ children }: Readonly<PropsWithChildren>) => {
  const { parentMessageId, profileMemberId, onClose } = usePanel();

  const showPanel = !!parentMessageId || !!profileMemberId;

  const { defaultLayout, onLayoutChange } = useDefaultLayout({
    id: 'slack-clone-workspace-layout',
    panelIds: showPanel ? ['sidebar', 'main', 'panel'] : ['sidebar', 'main'],
  });

  return (
    <div className="h-full">
      <Toolbar />

      <div className="flex h-[calc(100vh_-_40px)]">
        <Sidebar />

        <ResizablePanelGroup
          orientation="horizontal"
          defaultLayout={defaultLayout}
          onLayoutChange={onLayoutChange}
        >
          <ResizablePanel id="sidebar" defaultSize="20%" minSize="11%" className="bg-[#5E2C5F]">
            <WorkspaceSidebar />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel id="main" defaultSize="80%" minSize="20%">
            {children}
          </ResizablePanel>

          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel id="panel" minSize="20%" defaultSize="29%">
                {parentMessageId ? (
                  <Thread messageId={parentMessageId as Id<'messages'>} onClose={onClose} />
                ) : profileMemberId ? (
                  <Profile memberId={profileMemberId as Id<'members'>} onClose={onClose} />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceIdLayout;
