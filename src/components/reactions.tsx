import { MdOutlineAddReaction } from 'react-icons/md';

import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { cn } from '@/lib/utils';

import type { Doc, Id } from '../../convex/_generated/dataModel';
import { EmojiPopover } from './emoji-popover';
import { Hint } from './hint';

interface ReactionsProps {
  data: Array<
    Omit<Doc<'reactions'>, 'memberId'> & {
      count: number;
      memberIds: Id<'members'>[];
    }
  >;
  onChange: (value: string) => void;
}

export const Reactions = ({ data, onChange }: ReactionsProps) => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });

  const currentMemberId = currentMember?._id;

  if (data.length === 0 || !currentMemberId) return null;

  return (
    <div className="my-1 flex items-center gap-1">
      {data.map((reaction) => (
        <Hint key={reaction._id} label={`${reaction.count} ${reaction.count === 1 ? 'person' : 'people'} reacted with ${reaction.value}`}>
          <button
            onClick={() => onChange(reaction.value)}
            className={cn(
              'flex h-6 items-center gap-x-1 rounded-full border border-transparent bg-muted px-2 text-foreground',
              reaction.memberIds.includes(currentMemberId) &&
                'border-blue-500 bg-blue-100/70 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
            )}
          >
            {reaction.value}{' '}
            <span
              className={cn(
                'text-xs font-semibold text-muted-foreground',
                reaction.memberIds.includes(currentMemberId) && 'text-blue-600 dark:text-blue-400',
              )}
            >
              {reaction.count}
            </span>
          </button>
        </Hint>
      ))}

      <EmojiPopover hint="Add a reaction" onEmojiSelect={onChange}>
        <button className="flex h-7 items-center gap-x-1 rounded-full border border-transparent bg-muted px-3 text-foreground hover:border-border">
          <MdOutlineAddReaction className="size-4" />
        </button>
      </EmojiPopover>
    </div>
  );
};
