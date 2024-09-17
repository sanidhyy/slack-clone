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

  const handleSubmit = ({ body, image }: { body: string; image: File | null }) => {
    console.log({ body, image });
  };

  return (
    <div className="px-5 w-full">
      <Editor placeholder={placeholder} onSubmit={handleSubmit} disabled={false} innerRef={innerRef} />
    </div>
  );
};
