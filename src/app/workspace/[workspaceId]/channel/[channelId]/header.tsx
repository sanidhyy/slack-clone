import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  channelName: string;
}

export const Header = ({ channelName }: HeaderProps) => {
  const [value, setValue] = useState(channelName);
  const [editOpen, setEditOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '-').toLowerCase();

    setValue(value);
  };

  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className="text-lg font-semibold px-2 overflow-hidden w-auto" size="sm">
            <span className="truncate"># {channelName}</span>
            <FaChevronDown className="size-2.5 ml-2" />
          </Button>
        </DialogTrigger>

        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle># {channelName}</DialogTitle>

            <VisuallyHidden.Root>
              <DialogDescription>Your channel preferences</DialogDescription>
            </VisuallyHidden.Root>
          </DialogHeader>

          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <button
                  disabled={false}
                  className="flex flex-col disabled:pointer-events-none disabled:opacity-50 w-full px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between w-full">
                    <p className="text-sm font-semibold">Channel name</p>
                    <p className="text-sm text-[#1264A3] hover:underline font-semibold">Edit</p>
                  </div>

                  <p className="text-sm"># {channelName}</p>
                </button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this channel</DialogTitle>

                  <VisuallyHidden.Root>
                    <DialogDescription>Rename this channel to match your case.</DialogDescription>
                  </VisuallyHidden.Root>
                </DialogHeader>

                <form className="space-y-4">
                  <Input
                    value={value}
                    disabled={false}
                    onChange={handleChange}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={20}
                    placeholder="e.g. plan-budget"
                  />

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={false}>
                        Cancel
                      </Button>
                    </DialogClose>

                    <Button disabled={false}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <button
              disabled={false}
              className="flex disabled:pointer-events-none disabled:opacity-50 items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
            >
              <Trash className="size-4" />
              <p className="text-sm font-semibold">Delete channel</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
