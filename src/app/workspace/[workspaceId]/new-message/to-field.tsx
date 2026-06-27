'use client';

import { Hash, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import type { Id } from '@/../convex/_generated/dataModel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useGetMembers } from '@/features/members/api/use-get-members';

type MemberRecipient = {
  type: 'member';
  id: Id<'members'>;
  name: string;
  email: string;
  image?: string;
};

type ChannelRecipient = {
  type: 'channel';
  id: Id<'channels'>;
  name: string;
};

export type Recipient = MemberRecipient | ChannelRecipient;

interface ToFieldProps {
  workspaceId: Id<'workspaces'>;
  value: Recipient[];
  onChange: (recipients: Recipient[]) => void;
}

export const ToField = ({ workspaceId, value, onChange }: ToFieldProps) => {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: members } = useGetMembers({ workspaceId });
  const { data: channels } = useGetChannels({ workspaceId });

  const query = inputValue.toLowerCase().trim();
  const isChannelQuery = query.startsWith('#');
  const searchTerm = isChannelQuery ? query.slice(1) : query;

  const filteredMembers = isChannelQuery
    ? []
    : (members ?? []).filter(
        (m) =>
          !value.some((r) => r.type === 'member' && r.id === m._id) &&
          (m.user.name?.toLowerCase().includes(searchTerm) || m.user.email?.toLowerCase().includes(searchTerm)),
      );

  const filteredChannels = (channels ?? []).filter(
    (c) => !value.some((r) => r.type === 'channel' && r.id === c._id) && c.name.toLowerCase().includes(searchTerm),
  );

  const suggestions: Array<
    { kind: 'member'; member: (typeof filteredMembers)[0] } | { kind: 'channel'; channel: (typeof filteredChannels)[0] }
  > = [
    ...filteredMembers.map((m) => ({ kind: 'member' as const, member: m })),
    ...(isChannelQuery ? [] : filteredChannels.map((c) => ({ kind: 'channel' as const, channel: c }))),
    ...(isChannelQuery ? filteredChannels.map((c) => ({ kind: 'channel' as const, channel: c })) : []),
  ];

  const showDropdown = open && suggestions.length > 0;

  useEffect(() => {
    setActiveIndex(0);
  }, [inputValue]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addRecipient = (suggestion: (typeof suggestions)[0]) => {
    if (suggestion.kind === 'member') {
      const m = suggestion.member;
      onChange([
        ...value,
        {
          type: 'member',
          id: m._id,
          name: m.user.name ?? 'Unknown',
          email: m.user.email ?? '',
          image: m.user.image,
        },
      ]);
    } else {
      const c = suggestion.channel;
      onChange([...value, { type: 'channel', id: c._id, name: c.name }]);
    }
    setInputValue('');
    setOpen(false);
    inputRef.current?.focus();
  };

  const removeRecipient = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeRecipient(value.length - 1);
      return;
    }

    if (!showDropdown) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions[activeIndex]) addRecipient(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        className="flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 focus-within:border-ring focus-within:shadow-sm"
        onClick={() => inputRef.current?.focus()}
      >
        <span className="text-sm font-medium text-muted-foreground">To:</span>

        {value.map((recipient, i) => (
          <span
            key={i}
            className="flex items-center gap-1 rounded-md bg-[#1264a3]/10 px-2 py-0.5 text-sm font-medium text-[#1264a3] dark:bg-[#4d9de0]/20 dark:text-[#4d9de0]"
          >
            {recipient.type === 'member' ? (
              <>
                <Avatar className="size-4">
                  <AvatarImage src={recipient.image} />
                  <AvatarFallback className="text-[9px]">{recipient.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                {recipient.name}
              </>
            ) : (
              <>
                <Hash className="size-3" />
                {recipient.name}
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeRecipient(i);
              }}
              className="ml-0.5 rounded-sm hover:text-[#1264a3]/60 dark:hover:text-[#4d9de0]/60"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? 'Name, email, or #channel' : ''}
          className="min-w-[160px] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-56 overflow-y-auto rounded-md border border-border bg-background shadow-md">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onMouseDown={(e) => {
                e.preventDefault();
                addRecipient(s);
              }}
              onMouseEnter={() => setActiveIndex(i)}
              className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm ${i === activeIndex ? 'bg-muted' : 'hover:bg-muted/50'}`}
            >
              {s.kind === 'member' ? (
                <>
                  <Avatar className="size-6">
                    <AvatarImage src={s.member.user.image} />
                    <AvatarFallback className="text-xs">{s.member.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{s.member.user.name}</span>
                    <span className="text-xs text-muted-foreground">{s.member.user.email}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex size-6 items-center justify-center rounded-sm bg-muted">
                    <Hash className="size-3.5 text-muted-foreground" />
                  </div>
                  <span className="font-medium">#{s.channel.name}</span>
                </>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
