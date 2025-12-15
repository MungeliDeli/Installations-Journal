// Simple test to verify image upload with reference-based folders
import { ImageService } from "./src/service/image.service.js";
import fs from "fs";
import path from "path";

async function testImageUpload() {
  try {
    // Create a simple test image buffer (1x1 pixel PNG)
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0x00, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x5C, 0xC2, 0x8A, 0x8B, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    const testReference = "TEST-REF-123";
    const testFileName = "test-image.png";

    console.log("Testing image upload with reference-based folder...");
    console.log(`Reference: ${testReference}`);
    console.log(`Expected folder: installation-images/${testReference.replace(/[^a-zA-Z0-9-_]/g, "-")}/`);

    const result = await ImageService.processAndUpload(
      testImageBuffer,
      testFileName,
      testReference
    );

    console.log("Upload successful!");
    console.log("Result:", result);
    console.log("Key:", result.key);
    console.log("URL:", result.url);

    // Verify the key contains the reference
    const expectedFolder = `installation-images/${testReference.replace(/[^a-zA-Z0-9-_]/g, "-")}/`;
    if (result.key.startsWith(expectedFolder)) {
      console.log("✅ Folder structure is correct!");
    } else {
      console.log("❌ Folder structure is incorrect!");
      console.log(`Expected to start with: ${expectedFolder}`);
      console.log(`Actual key: ${result.key}`);
    }

  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testImageUpload();
}