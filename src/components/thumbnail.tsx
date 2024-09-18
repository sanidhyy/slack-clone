import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ThumbnailProps {
  url: string | null | undefined;
}

export const Thumbnail = ({ url }: ThumbnailProps) => {
  if (!url) return null;

  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Message image" className="rounded-md object-cover size-full" />
        </div>
      </DialogTrigger>

      <DialogContent isThumbnail className="max-w-[800px] border-none bg-transparent p-0 shadow-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="Message image" className="rounded-md object-cover size-full" />
      </DialogContent>
    </Dialog>
  );
};
