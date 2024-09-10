'use client';

import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useRemoveWorkspace } from '@/features/workspaces/api/use-remove-workspace';
import { useUpdateWorkspace } from '@/features/workspaces/api/use-update-workspace';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

interface PreferencesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}

export const PreferencesModal = ({ open, setOpen, initialValue }: PreferencesModalProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [value, setValue] = useState(initialValue);
  const [editOpen, setEditOpen] = useState(false);

  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspace();
  const { mutate: removeWorkspace, isPending: isRemovingWorkspace } = useRemoveWorkspace();

  const handleRemove = () => {
    removeWorkspace(
      {
        id: workspaceId,
      },
      {
        onSuccess: () => {
          toast.success('Workspace removed.');

          setOpen(false);
          router.replace('/');
        },
        onError: () => {
          toast.error('Failed to remove workspace.');
        },
      },
    );
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateWorkspace(
      {
        id: workspaceId,
        name: value,
      },
      {
        onSuccess: () => {
          toast.success('Workspace updated.');
          setEditOpen(false);
        },
        onError: () => {
          toast.error('Failed to update workspace.');
        },
      },
    );
  };

  return (
    <Dialog open={open || isUpdatingWorkspace || isRemovingWorkspace} onOpenChange={setOpen}>
      <DialogContent className="p-0 bg-gray-50 overflow-hidden">
        <DialogHeader className="p-4 border-b bg-white">
          <DialogTitle>{value}</DialogTitle>
        </DialogHeader>

        <div className="px-4 pb-4 flex flex-col gap-y-2">
          <Dialog open={editOpen || isUpdatingWorkspace} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <button
                disabled={isUpdatingWorkspace || isRemovingWorkspace}
                className="flex flex-col disabled:pointer-events-none disabled:opacity-50 w-full px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center justify-between w-full">
                  <p className="text-sm font-semibold">Workspace name</p>

                  <p className="text-sm text-[#1264A3] hover:underline cursor-pointer font-semibold">Edit</p>
                </div>

                <p className="text-sm">{value}</p>
              </button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename this workspace</DialogTitle>
              </DialogHeader>

              <form className="space-y-4" onSubmit={handleEdit}>
                <Input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  disabled={isUpdatingWorkspace}
                  required
                  autoFocus
                  minLength={3}
                  maxLength={20}
                  placeholder="Workspace name e.g 'Work', 'Personal', 'Home'"
                />

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" disabled={isUpdatingWorkspace}>
                      Cancel
                    </Button>
                  </DialogClose>

                  <Button disabled={isUpdatingWorkspace}>Save</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <button
            disabled={isRemovingWorkspace}
            onClick={handleRemove}
            className="flex items-center disabled:pointer-events-none disabled:opacity-50 gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
          >
            <Trash className="size-4" />
            <p className="text-sm font-semibold">Delete workspace</p>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
