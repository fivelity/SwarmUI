interface ImageGalleryProps {
  images: string[];
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-border mt-4 pt-4">
      <h3 className="text-lg font-bold mb-4 text-accent">Results</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <img key={index} src={`data:image/png;base64,${image}`} alt={`Generated image ${index + 1}`} className="rounded-lg" />
        ))}
      </div>
    </div>
  );
};
