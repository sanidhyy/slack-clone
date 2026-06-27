'use client';

import { SquarePen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type Quill from 'quill';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import type { Id } from '@/../convex/_generated/dataModel';
import Editor from '@/components/editor';
import { useCreateOrGetConversation } from '@/features/conversations/api/use-create-or-get-conversation';
import { useCreateMessage } from '@/features/messages/api/use-create-message';
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { type Recipient, ToField } from './to-field';

const NewMessagePage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const editorRef = useRef<Quill | null>(null);

  const { mutate: createMessage } = useCreateMessage();
  const { mutate: createOrGetConversation } = useCreateOrGetConversation();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const handleSubmit = async ({ body, image }: { body: string; image: File | null }) => {
    if (recipients.length === 0) {
      toast.error('Please add at least one recipient.');
      return;
    }

    try {
      setIsPending(true);
      editorRef.current?.enable(false);

      let imageId: Id<'_storage'> | undefined;
      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });
        if (!url) throw new Error('Upload URL not found.');

        const result = await fetch(url, {
          method: 'POST',
          headers: { 'Content-type': image.type },
          body: image,
        });
        if (!result.ok) throw new Error('Failed to upload image.');
        const { storageId } = await result.json();
        imageId = storageId;
      }

      const navigateTo =
        recipients.length === 1
          ? recipients[0].type === 'channel'
            ? `/workspace/${workspaceId}/channel/${recipients[0].id}`
            : `/workspace/${workspaceId}/member/${recipients[0].id}`
          : null;

      await Promise.all(
        recipients.map(async (recipient) => {
          if (recipient.type === 'channel') {
            await createMessage({ workspaceId, channelId: recipient.id, body, image: imageId }, { throwError: true });
          } else {
            const conversationId = await createOrGetConversation({ workspaceId, memberId: recipient.id }, { throwError: true });
            if (!conversationId) throw new Error('Failed to create conversation.');
            await createMessage({ workspaceId, conversationId, body, image: imageId }, { throwError: true });
          }
        }),
      );

      setEditorKey((k) => k + 1);
      setRecipients([]);

      if (navigateTo) router.push(navigateTo);
    } catch {
      toast.error('Failed to send message.');
    } finally {
      setIsPending(false);
      editorRef.current?.enable(true);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[49px] items-center overflow-hidden border-b bg-background px-4">
        <SquarePen className="mr-2 size-5 text-muted-foreground" />
        <span className="text-lg font-semibold">New message</span>
      </div>

      <div className="border-b px-4 py-2">
        <ToField workspaceId={workspaceId} value={recipients} onChange={setRecipients} />
      </div>

      <div className="flex-1" />

      <div className="px-4 pb-4">
        <Editor
          key={editorKey}
          innerRef={editorRef}
          onSubmit={handleSubmit}
          placeholder="Write your message..."
          variant="create"
          disabled={isPending}
        />
      </div>
    </div>
  );
};

export default NewMessagePage;
