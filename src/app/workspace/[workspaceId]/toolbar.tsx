'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';

import type { Id } from '@/../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { links } from '@/config';
import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

export const Toolbar = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { data } = useGetWorkspace({ id: workspaceId });
  const { data: channels } = useGetChannels({ workspaceId });
  const { data: members } = useGetMembers({ workspaceId });

  const [open, setOpen] = useState(false);

  const onChannelClick = (channelId: Id<'channels'>) => {
    setOpen(false);

    router.push(`/workspace/${workspaceId}/channel/${channelId}`);
  };

  const onMemberClick = (memberId: Id<'members'>) => {
    setOpen(false);

    router.push(`/workspace/${workspaceId}/member/${memberId}`);
  };

  return (
    <nav className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" aria-hidden />

      <div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
        <Button onClick={() => setOpen(true)} size="sm" className="bg-accent/25 hover:bg-accent/25 w-full justify-start h-7 px-2">
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">Search {data?.name ?? 'workspace'}...</span>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem onSelect={() => onChannelClick(channel._id)} key={channel._id}>
                  {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Members">
              {members?.map((member) => (
                <CommandItem onSelect={() => onMemberClick(member._id)} key={member._id}>
                  {member.user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>

      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant="transparent" size="iconSm" asChild>
          <Link href={links.sourceCode} target="_blank" rel="noreferrer noopener" title="Source Code">
            <FaGithub className="size-5 text-white" />
          </Link>
        </Button>
      </div>
    </nav>
  );
};
