import { useState } from "react";
import * as React from "react";
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

  // Add keyboard event listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-full max-h-full w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 text-white hover:text-(--color-accent-red) transition-colors bg-black/50 rounded-full p-2 backdrop-blur-sm"
          aria-label="Close image viewer"
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
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-(--color-accent-red) transition-colors bg-black/50 rounded-full p-2 sm:p-3 backdrop-blur-sm"
              aria-label="Previous image"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>
            <button
              onClick={onNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-(--color-accent-red) transition-colors bg-black/50 rounded-full p-2 sm:p-3 backdrop-blur-sm"
              aria-label="Next image"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </button>
          </>
        )}

        {/* Image */}
        <img
          src={image.url}
          alt={`Installation image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain rounded shadow-2xl"
          style={{ maxHeight: 'calc(100vh - 120px)' }}
        />

        {/* Image info */}
        <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 bg-black/70 text-white p-2 sm:p-3 rounded backdrop-blur-sm">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span>Image {currentIndex + 1} of {totalImages}</span>
            <span>{(image.size / 1024).toFixed(1)} KB</span>
          </div>
          {totalImages > 1 && (
            <div className="mt-2 text-xs text-gray-300">
              Use arrow keys or swipe to navigate
            </div>
          )}
        </div>

        {/* Progress indicator */}
        {totalImages > 1 && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 sm:top-4 flex gap-1">
            {Array.from({ length: totalImages }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        )}
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
      {/* Debug button - remove this after testing */}
      {images.length > 0 && (
        <button 
          onClick={() => openModal(0)}
          className="mb-4 px-4 py-2 bg-(--color-accent-red) text-white rounded hover:bg-red-600 transition-colors"
        >
          Test Modal (Click to open first image)
        </button>
      )}
      
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 ${className}`}>
        {images.map((image, index) => (
          <div 
            key={index} 
            className="relative group cursor-pointer"
            onClick={() => openModal(index)}
          >
            {loadingImages.has(index) && (
              <ImageSkeleton className="absolute inset-0 w-full h-20 sm:h-24 pointer-events-none" />
            )}
            <img
              src={image.url}
              alt={`Installation image ${index + 1}`}
              className="w-full h-20 sm:h-24 object-cover rounded border border-(--color-border) transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg"
              onLoad={() => handleImageLoad(index)}
              onError={(e) => {
                handleImageError(index);
                // Show a broken image placeholder
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgcnk9IjIiIHN0cm9rZT0iIzZiNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSIjMWEyMzMyIi8+CjxjaXJjbGUgY3g9IjkiIGN5PSI5IiByPSIyIiBzdHJva2U9IiM2YjcyODAiIHN0cm9rZS13aWR0aD0iMiIvPgo8cGF0aCBkPSJtMjEgMTUtMy4wODYtMy4wODZhMiAyIDAgMCAwLTIuODI4IDBMNiAyMSIgc3Ryb2tlPSIjNmI3MjgwIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+';
              }}
              style={{ display: loadingImages.has(index) ? 'none' : 'block' }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center pointer-events-none">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-white sm:w-5 sm:h-5"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded pointer-events-none">
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