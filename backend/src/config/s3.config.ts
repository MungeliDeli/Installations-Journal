import "dotenv/config";
import { S3Client } from "@aws-sdk/client-s3";

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_S3_BUCKET_NAME,
} = process.env;

if (
  !AWS_ACCESS_KEY_ID ||
  !AWS_SECRET_ACCESS_KEY ||
  !AWS_REGION ||
  !AWS_S3_BUCKET_NAME
) {
  throw new Error("Invalid AWS S3 environment configuration");
}

export const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export const S3_CONFIG = {
  bucketName: AWS_S3_BUCKET_NAME,
  region: AWS_REGION,
  imageFolder: "installation-images/",
  profileImageFolder: "profile-images/",
};
