import sharp from "sharp";
import { Upload } from "@aws-sdk/lib-storage";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, S3_CONFIG } from "../config/s3.config.js";
import { Readable } from "stream";

interface ProcessedImage {
  buffer: Buffer;
  size: number;
  contentType: string;
}

interface Uploadedimage {
  url: string;
  key: string;
  size: number;
}

export class ImageService {
  /**
   * Processes and uploads an image to S3
   * - Auto-rotate based on EXIF orientation (fixes rotation issues)
   * - Compress to under 500kb
   * - Resize to max width or height of 1920px
   * - Convert to JPEG format
   * - Strip metadata for privacy and smaller file size
   */
  static async processImage(buffer: Buffer): Promise<ProcessedImage> {
    let quality = 85;
    let processedBuffer: Buffer;
    let imageSize: number;

    const metadata = await sharp(buffer).metadata();

    let sharpInstance = sharp(buffer)
      .rotate() // Auto-rotate based on EXIF orientation data - this fixes rotation issues
      .withMetadata(false); // Strip EXIF and other metadata for privacy and smaller file size

    // Resize if image is larger than 1920px on either dimension
    if (metadata.width && metadata.width > 1920 || metadata.height && metadata.height > 1920) {
      sharpInstance = sharpInstance.resize(1920, 1920, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // Compress until under 500kb or quality gets too low
    do {
      processedBuffer = await sharpInstance.jpeg({ 
        quality,
        progressive: true, // Progressive JPEG for better loading experience
        mozjpeg: true // Use mozjpeg encoder for better compression
      }).toBuffer();
      imageSize = processedBuffer.length;

      if (imageSize > 500 * 1024) {
        quality -= 5;
      }

      if (quality < 50) {
        break; // Prevent quality from going too low
      }
    } while (imageSize > 500 * 1024 && quality >= 50);

    return {
      buffer: processedBuffer,
      size: imageSize,
      contentType: "image/jpeg",
    };
  }

  /**
   * Uploads an image buffer to S3 with reference-specific folder
   */
  static async uploadToS3(
    processedImage: ProcessedImage,
    fileName: string,
    reference: string
  ): Promise<Uploadedimage> {
    // Sanitize reference for use in folder name
    const sanitizedReference = reference.replace(/[^a-zA-Z0-9-_]/g, "-");
    const key = `${S3_CONFIG.imageFolder}${sanitizedReference}/${Date.now()}-${fileName.replace(
      /\s+/g,
      "-"
    )}.jpg`;

    const stream = Readable.from(processedImage.buffer);

    // upload to S3 using multipart upload
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: S3_CONFIG.bucketName,
        Key: key,
        Body: stream,
        ContentType: processedImage.contentType,
        ACL: "public-read", //Make the file publicly readable
      },
    });

    await upload.done();

    // this is the public url
    const url = `https://${S3_CONFIG.bucketName}.s3.${S3_CONFIG.region}.amazonaws.com/${key}`;

    return {
      url,
      key,
      size: processedImage.size,
    };
  }

  // Deletes an image from S3
  static async deleteFromS3(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: S3_CONFIG.bucketName,
      Key: key,
    });
    await s3Client.send(command);
  }

  // deletes multiple images from S3
  static async deleteMultipleFromS3(keys: string[]): Promise<void> {
    const deletePromises = keys.map((key) => this.deleteFromS3(key));
    await Promise.all(deletePromises);
  }

  // Handles the full process of processing and uploading an image
  static async processAndUpload(
    buffer: Buffer,
    fileName: string,
    reference: string
  ): Promise<Uploadedimage> {
    const processedImage = await this.processImage(buffer);
    const uploadedImage = await this.uploadToS3(processedImage, fileName, reference);
    return uploadedImage;
  }
}
