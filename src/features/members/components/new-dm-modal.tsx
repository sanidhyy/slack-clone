'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { useNewDmModal } from '../store/use-new-dm-modal';

export const NewDmModal = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useNewDmModal();
  const [search, setSearch] = useState('');

  const { data: members } = useGetMembers({ workspaceId });

  const filtered = members?.filter((m) => m.user.name?.toLowerCase().includes(search.toLowerCase()));

  const handleSelect = (memberId: string) => {
    setOpen(false);
    setSearch('');
    router.push(`/workspace/${workspaceId}/member/${memberId}`);
  };

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) setSearch('');
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden p-0">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle>New Direct Message</DialogTitle>
        </DialogHeader>

        <div className="px-4 pb-2">
          <Input autoFocus placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="max-h-60 overflow-y-auto pb-2">
          {filtered?.map((member) => (
            <button
              key={member._id}
              onClick={() => handleSelect(member._id)}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-muted"
            >
              <Avatar className="size-7">
                <AvatarImage src={member.user.image} alt={member.user.name} />
                <AvatarFallback className="text-xs">{member.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span>{member.user.name}</span>
            </button>
          ))}

          {filtered?.length === 0 && <p className="px-4 py-6 text-center text-sm text-muted-foreground">No members found.</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
};
