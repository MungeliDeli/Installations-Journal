export const config = {
  API_BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  SERVER_BASE_URL: import.meta.env.VITE_SERVER_URL || "http://localhost:3000",
};

export const getImageUrl = (imagePath: string | undefined | null): string | null => {
  if (!imagePath) return null;
  
  // If it's already a full URL (S3 or other CDN), return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it's a relative path (legacy local uploads), prepend the server base URL
  return `${config.SERVER_BASE_URL}${imagePath}`;
};