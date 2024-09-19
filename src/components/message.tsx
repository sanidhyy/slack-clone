import { format, isToday, isYesterday } from 'date-fns';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRemoveMessage } from '@/features/messages/api/use-remove-message';
import { useUpdateMessage } from '@/features/messages/api/use-update-message';
import { useConfirm } from '@/hooks/use-confirm';
import { cn } from '@/lib/utils';

import type { Doc, Id } from '../../convex/_generated/dataModel';
import { Hint } from './hint';
import { Thumbnail } from './thumbnail';
import { Toolbar } from './toolbar';

const Renderer = dynamic(() => import('./renderer'), { ssr: false });
const Editor = dynamic(() => import('./editor'), { ssr: false });

interface MessageProps {
  id: Id<'messages'>;
  memberId: Id<'members'>;
  authorName?: string;
  authorImage?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<'reactions'>, 'memberId'> & {
      count: number;
      memberIds: Id<'members'>[];
    }
  >;
  body: Doc<'messages'>['body'];
  image: string | null | undefined;
  createdAt: Doc<'messages'>['_creationTime'];
  updatedAt: Doc<'messages'>['updatedAt'];
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<'messages'> | null) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
}

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : format(date, 'MMM d, yyyy')} at ${format(date, 'h:mm:ss a')}`;
};

export const Message = ({
  id,
  isAuthor,
  body,
  createdAt,
  image,
  isEditing,
  authorName = 'Member',
  authorImage,
  memberId,
  reactions,
  setEditingId,
  updatedAt,
  hideThreadButton,
  isCompact,
  threadCount,
  threadImage,
  threadTimestamp,
}: MessageProps) => {
  const [ConfirmDialog, confirm] = useConfirm('Delete message', 'Are you sure you want to delete this message? This cannot be undone.');

  const { mutate: updateMessage, isPending: isUpdatingMessage } = useUpdateMessage();
  const { mutate: removeMessage, isPending: isRemovingMessage } = useRemoveMessage();

  const avatarFallback = authorName.charAt(0).toUpperCase();
  const isPending = isUpdatingMessage || isRemovingMessage;

  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess: () => {
          toast.success('Message updated.');
          setEditingId(null);
        },
        onError: () => {
          toast.error('Failed to update message.');
        },
      },
    );
  };

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    removeMessage(
      { id },
      {
        onSuccess: () => {
          toast.success('Message deleted.');

          // TODO: close thread if opened
        },
        onError: () => {
          toast.error('Failed to delete message.');
        },
      },
    );
  };

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />

        <div
          className={cn(
            'flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative',
            isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
            isRemovingMessage && 'bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200',
          )}
        >
          <div className="flex items-start gap-2">
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="text-sm text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                {format(new Date(createdAt), 'hh:mm')}
              </button>
            </Hint>

            {isEditing ? (
              <div className="size-full">
                <Editor
                  onSubmit={handleUpdate}
                  disabled={isPending}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                />
              </div>
            ) : (
              <div className="flex flex-col w-full">
                <Renderer value={body} />
                <Thumbnail url={image} />

                {updatedAt ? <span className="text-xs text-muted-foreground">(edited)</span> : null}
              </div>
            )}
          </div>

          {!isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={() => setEditingId(id)}
              handleThread={() => {}}
              handleDelete={handleDelete}
              handleReaction={() => {}}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <ConfirmDialog />

      <div
        className={cn(
          'flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative',
          isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
          isRemovingMessage && 'bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200',
        )}
      >
        <div className="flex items-start gap-2">
          <button>
            <Avatar>
              <AvatarImage alt={authorName} src={authorImage} />

              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          </button>

          {isEditing ? (
            <div className="size-full">
              <Editor
                onSubmit={handleUpdate}
                disabled={isPending}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant="update"
              />
            </div>
          ) : (
            <div className="flex flex-col w-full overflow-hidden">
              <div className="text-sm">
                <button onClick={() => {}} className="font-bold text-primary hover:underline">
                  {authorName}
                </button>

                <span>&nbsp;&nbsp;</span>

                <Hint label={formatFullTime(new Date(createdAt))}>
                  <button className="text-xs text-muted-foreground hover:underline">{format(new Date(createdAt), 'h:mm a')}</button>
                </Hint>
              </div>

              <Renderer value={body} />
              <Thumbnail url={image} />

              {updatedAt ? <span className="text-xs text-muted-foreground">(edited)</span> : null}
            </div>
          )}
        </div>

        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleThread={() => {}}
            handleDelete={handleDelete}
            handleReaction={() => {}}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  );
};
