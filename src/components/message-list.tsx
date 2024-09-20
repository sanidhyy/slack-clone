import { differenceInMinutes, format, isToday, isYesterday } from 'date-fns';
import { Loader } from 'lucide-react';
import { useState } from 'react';

import { useCurrentMember } from '@/features/members/api/use-current-member';
import type { GetMessagesReturnType } from '@/features/messages/api/use-get-messages';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { Id } from '../../convex/_generated/dataModel';
import { ChannelHero } from './channel-hero';
import { ConversationHero } from './conversation-hero';
import { Message } from './message';

const TIME_THRESHOLD = 5;

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: 'channel' | 'thread' | 'conversation';
  data: GetMessagesReturnType | undefined;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);

  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';

  return format(date, 'EEEE, MMMM d');
};

export const MessageList = ({
  memberName,
  memberImage,
  channelName,
  channelCreationTime,
  data,
  variant = 'channel',
  loadMore,
  isLoadingMore,
  canLoadMore,
}: MessageListProps) => {
  const [editingId, setEditingId] = useState<Id<'messages'> | null>(null);

  const workspaceId = useWorkspaceId();

  const { data: currentMember } = useCurrentMember({ workspaceId });

  const groupedMessages = data?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, 'yyyy-MM-dd');

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].unshift(message);

      return groups;
    },
    {} as Record<string, typeof data>,
  );

  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
      {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />

            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              {formatDateLabel(dateKey)}
            </span>
          </div>

          {messages.map((message, i) => {
            const prevMessage = messages[i - 1];
            const isCompact =
              prevMessage &&
              prevMessage.user._id === message.user._id &&
              differenceInMinutes(new Date(message._creationTime), new Date(prevMessage._creationTime)) < TIME_THRESHOLD;

            return (
              <Message
                key={message._id}
                id={message._id}
                memberId={message.memberId}
                authorImage={message.user.image}
                authorName={message.user.name}
                isAuthor={message.memberId === currentMember?._id}
                reactions={message.reactions}
                body={message.body}
                image={message.image}
                updatedAt={message.updatedAt}
                createdAt={message._creationTime}
                threadCount={message.threadCount}
                threadImage={message.threadImage}
                threadName={message.threadName}
                threadTimestamp={message.threadTimestamp}
                isEditing={editingId === message._id}
                setEditingId={setEditingId}
                isCompact={isCompact}
                hideThreadButton={variant === 'thread'}
              />
            );
          })}
        </div>
      ))}

      <div
        className="h-1"
        ref={(el) => {
          if (el) {
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting && canLoadMore) loadMore();
              },
              { threshold: 1.0 },
            );

            observer.observe(el);

            return () => observer.disconnect();
          }
        }}
      />

      {isLoadingMore && (
        <div className="text-center my-2 relative">
          <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />

          <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
            <Loader className="size-4 animate-spin" />
          </span>
        </div>
      )}

      {variant === 'channel' && channelName && channelCreationTime && <ChannelHero name={channelName} creationTime={channelCreationTime} />}
      {variant === 'conversation' && <ConversationHero name={memberName} image={memberImage} />}
    </div>
  );
};
