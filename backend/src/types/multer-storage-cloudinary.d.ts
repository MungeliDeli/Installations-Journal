declare module "multer-storage-cloudinary" {
  import { StorageEngine } from "multer";
  import { v2 as cloudinary } from "cloudinary";

  interface CloudinaryStorageParams {
    folder?: string;
    format?: string;
    public_id?: string;
    allowed_formats?: string[];
    resource_type?: "image" | "video" | "raw" | "auto";
    transformation?: any[];
    [key: string]: any; // Allow additional properties
  }

  interface CloudinaryStorageOptions {
    cloudinary: typeof cloudinary;
    params:
      | CloudinaryStorageParams
      | ((
          req: any,
          file: any
        ) => Promise<CloudinaryStorageParams> | CloudinaryStorageParams);
  }

  export class CloudinaryStorage implements StorageEngine {
    constructor(options: CloudinaryStorageOptions);
    _handleFile(
      req: any,
      file: any,
      callback: (error?: any, info?: any) => void
    ): void;
    _removeFile(
      req: any,
      file: any,
      callback: (error: Error | null) => void
    ): void;
  }
}
