import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, Trash2 } from 'lucide-react';

interface ImageData {
  id: string;
  url: string;
  thumbnail?: string;
  filename?: string;
  metadata?: Record<string, any>;
}

interface ImageGalleryProps {
  images: ImageData[];
  onImageSelect?: (image: ImageData) => void;
  onImageDelete?: (imageId: string) => void;
}

export const ImageGallery = ({ images, onImageSelect, onImageDelete }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (image: ImageData) => {
    setSelectedImage(image.id);
    onImageSelect?.(image);
  };

  const handleDownload = (image: ImageData) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.filename || `image-${image.id}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (imageId: string) => {
    onImageDelete?.(imageId);
  };

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>No images to display</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4">
      {images.map((image) => (
        <Card 
          key={image.id} 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedImage === image.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => handleImageClick(image)}
        >
          <CardContent className="p-2">
            <div className="aspect-square relative group">
              <img
                src={image.thumbnail || image.url}
                alt={image.filename || `Image ${image.id}`}
                className="w-full h-full object-cover rounded"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(image.url, '_blank');
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(image);
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
                {onImageDelete && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(image.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            {image.filename && (
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {image.filename}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
