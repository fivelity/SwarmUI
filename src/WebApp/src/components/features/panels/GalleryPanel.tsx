import { ImageGallery } from './ImageGallery.tsx';

interface GalleryPanelProps {
  images: Array<{
    id: string;
    url: string;
    thumbnail?: string;
    filename?: string;
    metadata?: Record<string, any>;
  }>;
}

export const GalleryPanel = ({ images }: GalleryPanelProps) => (
  <ImageGallery images={images} />
);
