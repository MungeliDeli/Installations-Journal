// src/components/ui/ImageUpload.tsx

import { useState, useRef } from "react";
import { validateImageFile } from "../../utils/validation";

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  error?: string;
}

export default function ImageUpload({
  images,
  onImagesChange,
  maxImages = 10,
  error,
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);

    // Validate each file
    const validImageFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach((file) => {
      const validationError = validateImageFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
      } else {
        validImageFiles.push(file);
      }
    });

    // Show errors if any
    if (errors.length > 0) {
      alert(`File validation errors:\n${errors.join('\n')}`);
      if (validImageFiles.length === 0) return;
    }

    // Check if adding these files would exceed the limit
    if (images.length + validImageFiles.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    // Create previews
    const newPreviews: string[] = [];
    validImageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === validImageFiles.length) {
          setPreviews([...previews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    onImagesChange([...images, ...validImageFiles]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    onImagesChange(newImages);
    setPreviews(newPreviews);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-bold text-(--color-text-primary) tracking-[1px] uppercase">
          Images (Optional)
        </label>
        <span className="text-[10px] text-(--color-text-secondary)">
          {images.length}/{maxImages} images
        </span>
      </div>

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-all duration-200
          ${
            dragActive
              ? "border-(--color-accent-red) bg-(--color-accent-red)/5"
              : "border-(--color-border) hover:border-(--color-accent-red)/50"
          }
          ${images.length >= maxImages ? "opacity-50 cursor-not-allowed" : ""}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() =>
          images.length < maxImages && fileInputRef.current?.click()
        }
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          disabled={images.length >= maxImages}
        />

        <div className="flex flex-col items-center gap-2">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-(--color-text-secondary)"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>

          <div className="space-y-1">
            <p className="text-sm text-(--color-text-primary)">
              {images.length >= maxImages ? (
                "Maximum images reached"
              ) : (
                <>
                  <span className="text-(--color-accent-red) font-semibold">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </>
              )}
            </p>
            <p className="text-xs text-(--color-text-secondary)">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>
      </div>

      {/* Info Message */}
      <div className="flex items-start gap-2 p-3 bg-(--color-accent-red)/5 border border-(--color-accent-red)/20 rounded text-xs">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-(--color-accent-red) shrink-0 mt-0.5"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <p className="text-(--color-text-secondary)">
          Images will be automatically compressed to under 500KB. Once
          submitted, images cannot be edited or added later.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-(--color-accent-red) flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
            <line
              x1="15"
              y1="9"
              x2="9"
              y2="15"
              stroke="white"
              strokeWidth="2"
            />
            <line
              x1="9"
              y1="9"
              x2="15"
              y2="15"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
          {error}
        </p>
      )}

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="relative group border border-(--color-border) rounded-lg overflow-hidden bg-(--color-background)"
            >
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover"
              />

              {/* Image Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-2">
                <p className="text-[10px] text-white font-medium truncate">
                  {images[index].name}
                </p>
                <p className="text-[9px] text-white/70">
                  {formatFileSize(images[index].size)}
                </p>
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute top-2 right-2 p-1 bg-(--color-accent-red) text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
