# Image Upload Feature Documentation

## Overview
This feature allows users to upload images for each installation with automatic processing, S3 storage, and gallery viewing capabilities.

## Backend Implementation

### Folder Structure
Images are organized in S3 using the following structure:
```
installation-images/
├── {reference-1}/
│   ├── timestamp-image1.jpg
│   └── timestamp-image2.jpg
├── {reference-2}/
│   ├── timestamp-image3.jpg
│   └── timestamp-image4.jpg
```

Each installation uses its `reference` field as a unique folder identifier, ensuring images are properly organized and isolated.

### Image Processing
- **Compression**: Images are automatically compressed to under 500KB
- **Resizing**: Maximum dimensions of 1920px (width or height)
- **Format**: All images are converted to JPEG for consistency
- **Quality**: Adaptive quality reduction (85% down to 60% minimum)

### API Endpoints
- `POST /api/installations` - Create installation with images (max 10)
- `GET /api/installations` - Get all installations with image data
- `GET /api/installations/:id` - Get specific installation with images
- `DELETE /api/installations/:id` - Delete installation and all associated images

### File Structure
```
backend/
├── src/
│   ├── config/
│   │   └── s3.config.ts          # S3 configuration
│   ├── middleware/
│   │   └── upload.ts             # Multer configuration
│   ├── service/
│   │   └── image.service.ts      # Image processing and S3 operations
│   └── controller/
│       └── installation.controller.ts # Installation CRUD with images
```

## Frontend Implementation

### Components
- **ImageGallery**: Displays images in a responsive grid with modal viewer
- **ImageSkeleton**: Loading placeholder with shimmer animation
- **InstallationDetailsModal**: Updated to show image gallery

### Features
- **Responsive Grid**: 2-4 columns based on screen size
- **Modal Viewer**: Full-screen image viewing with navigation
- **Loading States**: Skeleton loading with shimmer animation
- **Error Handling**: Broken image fallbacks
- **Image Info**: File size display and navigation indicators

### File Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── ImageGallery.tsx
│   │   │   └── ImageSkeleton.tsx
│   │   └── installations/
│   │       └── InstallationDetailsModal.tsx
│   ├── services/
│   │   └── installationApi.ts    # API calls with FormData support
│   └── types/
│       └── installation.ts       # TypeScript interfaces
```

## Configuration

### Environment Variables
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_S3_BUCKET_NAME=your_bucket_name
```

### S3 Bucket Policy
Ensure your S3 bucket allows public read access for uploaded images:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/installation-images/*"
    }
  ]
}
```

## Usage

### Creating Installation with Images
```typescript
const formData = new FormData();
formData.append('customer', 'John Doe');
formData.append('reference', 'REF-123');
// ... other fields
images.forEach(image => formData.append('images', image));

const response = await installationApi.create(formData);
```

### Viewing Images
Images are automatically displayed in the InstallationDetailsModal when viewing an installation. The gallery supports:
- Click to view full-size
- Navigation between images
- Loading states
- Error handling

## Testing

### Backend Test
Run the image upload test:
```bash
cd backend
node test-image-upload.js
```

This will verify:
- Image processing works correctly
- S3 upload with proper folder structure
- Reference-based folder naming

### Frontend Testing
1. Create a new installation with images
2. View the installation details
3. Verify images display in gallery format
4. Test modal viewer functionality

## Security Considerations

1. **File Type Validation**: Only image files are accepted
2. **File Size Limits**: 5MB per file, 10 files maximum
3. **Image Processing**: All images are processed and converted to JPEG
4. **Access Control**: Images are tied to user accounts via authentication
5. **Cleanup**: Failed uploads are automatically cleaned up

## Performance Optimizations

1. **Image Compression**: Automatic size reduction
2. **Lazy Loading**: Images load as needed
3. **Parallel Processing**: Multiple images processed simultaneously
4. **CDN Ready**: S3 URLs can be easily integrated with CloudFront
5. **Skeleton Loading**: Smooth loading experience

## Troubleshooting

### Common Issues
1. **Images not displaying**: Check S3 bucket permissions and CORS settings
2. **Upload failures**: Verify AWS credentials and bucket configuration
3. **Slow uploads**: Consider implementing progress indicators for large files
4. **Memory issues**: Monitor server memory usage during bulk uploads

### Debug Steps
1. Check browser network tab for failed requests
2. Verify S3 bucket contents and folder structure
3. Check server logs for processing errors
4. Validate environment variables are set correctly