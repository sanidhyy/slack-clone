import { format, isToday, isYesterday } from 'date-fns';
import dynamic from 'next/dynamic';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import type { Doc, Id } from '../../convex/_generated/dataModel';
import { Hint } from './hint';

const Renderer = dynamic(() => import('./renderer'), { ssr: false });

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
  const avatarFallback = authorName.charAt(0).toUpperCase();

  if (isCompact) {
    return (
      <div className="flex flex-col gap-2 px-5 hover:bg-gray-100/60 group relative">
        <div className="flex items-center gap-2">
          <Hint label={formatFullTime(new Date(createdAt))}>
            <button className="text-sm text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
              {format(new Date(createdAt), 'hh:mm')}
            </button>
          </Hint>

          <div className="flex flex-col w-full">
            <Renderer value={body} />

            {updatedAt ? <span className="text-xs text-muted-foreground">(edited)</span> : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
      <div className="flex items-start gap-2">
        <button>
          <Avatar>
            <AvatarImage alt={authorName} src={authorImage} />

            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        </button>

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

          {updatedAt ? <span className="text-xs text-muted-foreground">(edited)</span> : null}
        </div>
      </div>
    </div>
  );
};
