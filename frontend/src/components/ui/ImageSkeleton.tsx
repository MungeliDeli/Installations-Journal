interface ImageSkeletonProps {
  className?: string;
}

export default function ImageSkeleton({ className = "" }: ImageSkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-700 rounded ${className}`}>
      <div className="w-full h-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />
    </div>
  );
}