'use client';

import dynamic from 'next/dynamic';
import type Quill from 'quill';
import { useRef } from 'react';

const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

interface ChatInputProps {
  placeholder?: string;
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const innerRef = useRef<Quill | null>(null);

  return (
    <div className="px-5 w-full">
      <Editor placeholder={placeholder} onSubmit={() => {}} disabled={false} innerRef={innerRef} />
    </div>
  );
};
