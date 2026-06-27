'use client';

import { CopyIcon, Mail, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInviteByEmail } from '@/features/workspaces/api/use-invite-by-email';
import { useNewJoinCode } from '@/features/workspaces/api/use-new-join-code';
import { useConfirm } from '@/hooks/use-confirm';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

export const InviteModal = ({ open, setOpen, name, joinCode }: InviteModalProps) => {
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm('Are you sure?', 'This will deactivate the current invite code and generate a new one.');
  const [email, setEmail] = useState('');

  const { mutate: newJoinCode, isPending: isNewCodePending } = useNewJoinCode();
  const { mutate: inviteByEmail, isPending: isInvitePending } = useInviteByEmail();

  const handleNewCode = async () => {
    const ok = await confirm();

    if (!ok) return;

    newJoinCode(
      { workspaceId },
      {
        onSuccess: () => toast.success('Invite code regenerated.'),
        onError: () => toast.error('Failed to regenerate invite code.'),
      },
    );
  };

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success('Invite link copied to clipboard.'))
      .catch(() => toast.error('Failed to copy link to clipboard'));
  };

  const handleEmailInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return;

    const result = await inviteByEmail({ workspaceId, email });

    if (!result) return;

    if (result.status === 'success') {
      toast.success(`Invitation sent to ${email}.`);
      setEmail('');
    } else if (result.status === 'already_member') {
      toast.error(`${email} is already a member of this workspace.`);
    } else {
      toast.error(`No account found for ${email}. Share the invite link instead.`);
    }
  };

  const isPending = isNewCodePending || isInvitePending;

  return (
    <>
      <ConfirmDialog />

      <Dialog open={open || isPending} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to {name}</DialogTitle>
            <DialogDescription>Add new members by email or share an invite link.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="email">
            <TabsList className="w-full">
              <TabsTrigger value="email" className="flex-1">
                <Mail className="mr-2 size-4" />
                Invite by email
              </TabsTrigger>
              <TabsTrigger value="link" className="flex-1">
                <CopyIcon className="mr-2 size-4" />
                Share link
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="mt-4">
              <form onSubmit={handleEmailInvite} className="flex flex-col gap-y-4">
                <Input
                  type="email"
                  placeholder="colleague@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPending}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  The person must already have an account. They will receive a DM in this workspace.
                </p>
                <div className="flex justify-end gap-x-2">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={isPending}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isPending || !email.trim()}>
                    Send invite
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="link" className="mt-4">
              <div className="flex flex-col items-center justify-center gap-y-4 py-6">
                <p className="text-4xl font-bold uppercase tracking-widest">{joinCode}</p>

                <Button disabled={isPending} onClick={handleCopy} variant="ghost" size="sm">
                  Copy link <CopyIcon className="ml-2 size-4" />
                </Button>
              </div>

              <div className="flex w-full items-center justify-between">
                <Button disabled={isPending} onClick={handleNewCode} variant="outline">
                  New code
                  <RefreshCcw className="ml-2 size-4" />
                </Button>

                <DialogClose asChild>
                  <Button disabled={isPending}>Close</Button>
                </DialogClose>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};
