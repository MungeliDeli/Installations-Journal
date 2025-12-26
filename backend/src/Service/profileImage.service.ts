import sharp from "sharp";
import { Upload } from "@aws-sdk/lib-storage";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, S3_CONFIG } from "../config/s3.config.js";
import { Readable } from "stream";

interface ProcessedProfileImage {
  buffer: Buffer;
  size: number;
  contentType: string;
}

interface UploadedProfileImage {
  url: string;
  key: string;
  size: number;
}

export class ProfileImageService {
  /**
   * Processes a profile image with specific requirements:
   * - Auto-rotate based on EXIF orientation (fixes rotation issues)
   * - Resize to 400x400 pixels (square)
   * - Compress to under 200kb
   * - Convert to JPEG format
   * - Strip metadata for privacy and smaller file size
   */
  static async processProfileImage(
    buffer: Buffer
  ): Promise<ProcessedProfileImage> {
    let quality = 90;
    let processedBuffer: Buffer;
    let imageSize: number;

    // Create a square 400x400 profile image with proper orientation handling
    // By default sharp strips metadata on output; avoid passing boolean to withMetadata
    let sharpInstance = sharp(buffer)
      .rotate() // Auto-rotate based on EXIF orientation data - this fixes rotation issues
      .resize(400, 400, {
        fit: "cover", // Crop to fill the square
        position: "center",
      });

    // Compress until under 200kb or quality gets too low
    do {
      processedBuffer = await sharpInstance
        .jpeg({
          quality,
          progressive: true, // Progressive JPEG for better loading experience
          mozjpeg: true, // Use mozjpeg encoder for better compression
        })
        .toBuffer();
      imageSize = processedBuffer.length;

      if (imageSize > 200 * 1024) {
        quality -= 5;
      }

      if (quality < 60) {
        break; // Prevent quality from going too low for profile images
      }
    } while (imageSize > 200 * 1024 && quality >= 60);

    return {
      buffer: processedBuffer,
      size: imageSize,
      contentType: "image/jpeg",
    };
  }

  /**
   * Uploads a profile image to S3 with user-specific folder
   */
  static async uploadProfileImageToS3(
    processedImage: ProcessedProfileImage,
    fileName: string,
    userId: string
  ): Promise<UploadedProfileImage> {
    // Create user-specific folder path
    const key = `${
      S3_CONFIG.profileImageFolder
    }${userId}/profile-${Date.now()}.jpg`;

    const stream = Readable.from(processedImage.buffer);

    // Upload to S3 using multipart upload
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: S3_CONFIG.bucketName,
        Key: key,
        Body: stream,
        ContentType: processedImage.contentType,
        ACL: "public-read", // Make the file publicly readable
        CacheControl: "max-age=31536000", // Cache for 1 year
      },
    });

    await upload.done();

    // Generate the public URL
    const url = `https://${S3_CONFIG.bucketName}.s3.${S3_CONFIG.region}.amazonaws.com/${key}`;

    return {
      url,
      key,
      size: processedImage.size,
    };
  }

  /**
   * Deletes a profile image from S3
   */
  static async deleteProfileImageFromS3(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: S3_CONFIG.bucketName,
      Key: key,
    });
    await s3Client.send(command);
  }

  /**
   * Deletes the old profile image and uploads a new one
   */
  static async replaceProfileImage(
    buffer: Buffer,
    fileName: string,
    userId: string,
    oldImageKey?: string
  ): Promise<UploadedProfileImage> {
    // Process and upload the new image
    const processedImage = await this.processProfileImage(buffer);
    const uploadedImage = await this.uploadProfileImageToS3(
      processedImage,
      fileName,
      userId
    );

    // Delete the old image if it exists
    if (oldImageKey) {
      try {
        await this.deleteProfileImageFromS3(oldImageKey);
      } catch (error) {
        console.error("Error deleting old profile image:", error);
        // Don't throw error here, as the new image was uploaded successfully
      }
    }

    return uploadedImage;
  }

  /**
   * Handles the full process of processing and uploading a profile image
   */
  static async processAndUploadProfile(
    buffer: Buffer,
    fileName: string,
    userId: string
  ): Promise<UploadedProfileImage> {
    const processedImage = await this.processProfileImage(buffer);
    const uploadedImage = await this.uploadProfileImageToS3(
      processedImage,
      fileName,
      userId
    );
    return uploadedImage;
  }
}
