# S3 Profile Images Implementation

## Overview
Migrated profile image storage from local file system to AWS S3, following the same pattern as installation images. Profile images are now stored in S3 with user-specific folders and optimized processing.

## Backend Changes

### 1. Updated S3 Configuration (`backend/src/config/s3.config.ts`)

#### Added Profile Images Folder:
```typescript
export const S3_CONFIG = {
  bucketName: AWS_S3_BUCKET_NAME,
  region: AWS_REGION,
  imageFolder: "installation-images/",
  profileImageFolder: "profile-images/", // New folder for profile images
};
```

### 2. Created Profile Image Service (`backend/src/service/profileImage.service.ts`)

#### Specialized Profile Image Processing:
- **Square Crop**: Resizes to 400x400 pixels with center crop
- **Optimized Compression**: Targets under 200KB file size
- **High Quality**: Maintains 70-90% JPEG quality
- **User Folders**: Creates `profile-images/{userId}/` structure

#### Key Methods:
```typescript
// Process profile image with specific requirements
static async processProfileImage(buffer: Buffer): Promise<ProcessedProfileImage>

// Upload to S3 with user-specific folder
static async uploadProfileImageToS3(processedImage, fileName, userId): Promise<UploadedProfileImage>

// Replace old image with new one (delete old, upload new)
static async replaceProfileImage(buffer, fileName, userId, oldImageKey): Promise<UploadedProfileImage>

// Delete profile image from S3
static async deleteProfileImageFromS3(key: string): Promise<void>
```

### 3. Enhanced User Model (`backend/src/model/user.model.ts`)

#### Added Profile Image Key:
```typescript
export interface IUser extends Document {
  // ... existing fields
  profileImage?: string;      // S3 URL
  profileImageKey?: string;   // S3 key for deletion
}
```

#### Schema Updates:
```typescript
profileImage: {
  type: String,
  default: null,
},
profileImageKey: {
  type: String,
  default: null,
},
```

### 4. Updated User Controller (`backend/src/controller/user.controller.ts`)

#### Multer Configuration:
- **Memory Storage**: Uses `multer.memoryStorage()` for S3 uploads
- **File Validation**: Validates image types and size limits
- **Buffer Processing**: Processes image buffers directly

#### Enhanced Upload Endpoint:
```typescript
export const uploadProfileImage = async (req: Request, res: Response) => {
  // 1. Validate user authentication
  // 2. Check for uploaded file
  // 3. Get current user for existing image cleanup
  // 4. Process and upload to S3 (with old image deletion)
  // 5. Update user record with new URL and key
  // 6. Return success response
};
```

## S3 Folder Structure

### Profile Images Organization:
```
your-s3-bucket/
├── installation-images/
│   └── {reference}/
│       └── {timestamp}-{filename}.jpg
└── profile-images/
    └── {userId}/
        └── profile-{timestamp}.jpg
```

### Benefits:
- **User Isolation**: Each user has their own folder
- **Easy Cleanup**: Can delete all user images by folder
- **Scalable**: No local storage limitations
- **CDN Ready**: S3 URLs work with CloudFront
- **Backup**: Automatic S3 backup and versioning

## Image Processing Specifications

### Profile Image Requirements:
- **Dimensions**: 400x400 pixels (square)
- **Format**: JPEG for optimal compression
- **Size**: Target under 200KB
- **Quality**: 70-90% JPEG quality
- **Crop**: Center crop to maintain aspect ratio
- **Cache**: 1-year cache headers for performance

### Processing Pipeline:
1. **Input Validation**: Check file type and size
2. **Sharp Processing**: Resize and crop to square
3. **Compression**: Iterative quality reduction to meet size target
4. **S3 Upload**: Multipart upload with public-read ACL
5. **Old Image Cleanup**: Delete previous image if exists
6. **Database Update**: Store new URL and key

## API Endpoints

### Profile Image Upload:
```
POST /api/user/upload-image
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body: profileImage (file)

Response: {
  "message": "Profile image uploaded successfully",
  "profileImage": "https://bucket.s3.region.amazonaws.com/profile-images/userId/profile-timestamp.jpg"
}
```

## Frontend Changes

### 1. Updated Image URL Helper (`frontend/src/utils/config.ts`)

#### Enhanced URL Handling:
```typescript
export const getImageUrl = (imagePath: string | undefined | null): string | null => {
  if (!imagePath) return null;
  
  // S3 URLs are already complete
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Legacy local uploads (fallback)
  return `${config.SERVER_BASE_URL}${imagePath}`;
};
```

### 2. Removed Local File Dependencies
- **No localhost hardcoding**: S3 URLs are absolute
- **Removed static file serving**: No longer needed
- **Backward compatibility**: Still handles legacy local images

## Security & Performance

### 1. S3 Security:
- **Public Read**: Images are publicly accessible via S3 URLs
- **Private Upload**: Only authenticated users can upload
- **User Isolation**: Each user can only access their own folder
- **Key Management**: S3 keys stored for proper cleanup

### 2. Performance Optimizations:
- **CDN Ready**: S3 URLs work with CloudFront
- **Optimized Size**: 200KB target for fast loading
- **Cache Headers**: 1-year cache for browser optimization
- **Compression**: High-quality JPEG compression

### 3. Error Handling:
- **Upload Failures**: Graceful error handling with cleanup
- **Old Image Cleanup**: Continues even if deletion fails
- **Validation**: Comprehensive file validation
- **Logging**: Detailed error logging for debugging

## Migration Considerations

### 1. Existing Users:
- **Legacy Images**: Old local images still work via fallback
- **Gradual Migration**: Users update images naturally over time
- **No Data Loss**: Existing profile images remain functional

### 2. Environment Setup:
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_S3_BUCKET_NAME=your_bucket_name
```

### 3. S3 Bucket Configuration:
- **Public Read Access**: For profile image viewing
- **CORS Configuration**: For frontend uploads
- **Lifecycle Rules**: Optional for old image cleanup

## Cost Optimization

### 1. Storage Costs:
- **Small Files**: 200KB average per profile image
- **Efficient Compression**: Reduces storage costs
- **Lifecycle Management**: Can archive old images

### 2. Transfer Costs:
- **Optimized Size**: Reduces bandwidth costs
- **CDN Integration**: Can use CloudFront for global delivery
- **Cache Headers**: Reduces repeated downloads

## Monitoring & Maintenance

### 1. Logging:
- **Upload Success/Failure**: Comprehensive logging
- **Error Tracking**: Detailed error information
- **Performance Metrics**: Upload time and size tracking

### 2. Cleanup Operations:
- **Orphaned Images**: Periodic cleanup of unused images
- **User Deletion**: Cleanup when users are deleted
- **Storage Monitoring**: Track S3 usage and costs

## Testing Checklist

### Backend Testing:
- [ ] Profile image upload to S3
- [ ] Old image deletion during replacement
- [ ] Error handling for upload failures
- [ ] User authentication validation
- [ ] File type and size validation
- [ ] S3 URL generation and storage

### Frontend Testing:
- [ ] Image upload with progress indication
- [ ] S3 URL display in all components
- [ ] Fallback for missing images
- [ ] Error handling for upload failures
- [ ] Loading states during upload

### Integration Testing:
- [ ] End-to-end image upload flow
- [ ] Cross-browser compatibility
- [ ] Mobile device testing
- [ ] Network failure scenarios
- [ ] Large file handling

## Future Enhancements

### Potential Improvements:
1. **Image Variants**: Multiple sizes (thumbnail, medium, large)
2. **WebP Support**: Modern image format for better compression
3. **Progressive Upload**: Chunked upload for large files
4. **Image Editing**: Built-in cropping and filters
5. **Batch Operations**: Multiple image uploads
6. **Analytics**: Track image usage and performance
7. **Backup Strategy**: Cross-region replication
8. **CDN Integration**: CloudFront distribution setup

## Implementation Summary

The S3 profile image system provides:
- **Scalable Storage**: No local disk limitations
- **Global Accessibility**: S3 URLs work worldwide
- **Optimized Performance**: Small file sizes and caching
- **Secure Access**: Proper authentication and isolation
- **Cost Effective**: Efficient compression and storage
- **Maintainable**: Clean separation of concerns
- **Future Ready**: Supports CDN and advanced features

This implementation aligns with modern cloud architecture best practices and provides a robust foundation for profile image management at scale.