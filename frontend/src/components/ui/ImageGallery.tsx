import { useState } from "react";
import type { InstallationImage } from "../../types/installation";
import ImageSkeleton from "./ImageSkeleton";

interface ImageGalleryProps {
  images: InstallationImage[];
  className?: string;
}

interface ImageModalProps {
  image: InstallationImage;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalImages: number;
}

function ImageModal({
  image,
  isOpen,
  onClose,
  onNext,
  onPrev,
  currentIndex,
  totalImages,
}: ImageModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4">
      <div className="relative max-w-4xl max-h-full">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-(--color-accent-red) transition-colors bg-black/50 rounded-full p-2"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Navigation buttons */}
        {totalImages > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-(--color-accent-red) transition-colors bg-black/50 rounded-full p-2"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-(--color-accent-red) transition-colors bg-black/50 rounded-full p-2"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </button>
          </>
        )}

        {/* Image */}
        <img
          src={image.url}
          alt={`Installation image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain rounded"
        />

        {/* Image info */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-3 rounded">
          <div className="flex justify-between items-center text-sm">
            <span>Image {currentIndex + 1} of {totalImages}</span>
            <span>{(image.size / 1024).toFixed(1)} KB</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ImageGallery({ images, className = "" }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [loadingImages, setLoadingImages] = useState<Set<number>>(new Set(images.map((_, i) => i)));

  const handleImageLoad = (index: number) => {
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  const handleImageError = (index: number) => {
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
    console.error(`Failed to load image at index ${index}:`, images[index]?.url);
  };

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1);
    }
  };

  if (images.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-(--color-text-secondary) text-sm">
          No images available for this installation
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 ${className}`}>
        {images.map((image, index) => (
          <div key={index} className="relative group cursor-pointer">
            {loadingImages.has(index) && (
              <ImageSkeleton className="absolute inset-0 w-full h-24" />
            )}
            <img
              src={image.url}
              alt={`Installation image ${index + 1}`}
              className="w-full h-24 object-cover rounded border border-(--color-border) transition-transform group-hover:scale-105"
              onLoad={() => handleImageLoad(index)}
              onError={(e) => {
                handleImageError(index);
                // Show a broken image placeholder
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgcnk9IjIiIHN0cm9rZT0iIzZiNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSIjMWEyMzMyIi8+CjxjaXJjbGUgY3g9IjkiIGN5PSI5IiByPSIyIiBzdHJva2U9IiM2YjcyODAiIHN0cm9rZS13aWR0aD0iMiIvPgo8cGF0aCBkPSJtMjEgMTUtMy4wODYtMy4wODZhMiAyIDAgMCAwLTIuODI4IDBMNiAyMSIgc3Ryb2tlPSIjNmI3MjgwIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+';
              }}
              onClick={() => openModal(index)}
              style={{ display: loadingImages.has(index) ? 'none' : 'block' }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-white"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
              {(image.size / 1024).toFixed(0)}KB
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImageIndex !== null && (
        <ImageModal
          image={images[selectedImageIndex]}
          isOpen={true}
          onClose={closeModal}
          onNext={nextImage}
          onPrev={prevImage}
          currentIndex={selectedImageIndex}
          totalImages={images.length}
        />
      )}
    </>
  );
}