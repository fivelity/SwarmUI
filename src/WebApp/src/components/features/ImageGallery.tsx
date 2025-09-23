interface ImageGalleryProps {
  images: string[];
}

import { ScrollArea } from '@/components/ui/scroll-area';

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  if (images.length === 0) {
    return (
      <div className="border-t border-border mt-4 pt-4 flex items-center justify-center h-full">
        <p className="text-muted-foreground">No images generated yet.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full w-full rounded-md border border-border mt-4">
      <div className="p-4">
        <h3 className="text-lg font-bold mb-4 text-accent">Results</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <img key={index} src={`data:image/png;base64,${image}`} alt={`Generated image ${index + 1}`} className="rounded-lg" />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};
