// src/cloudinary/cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';
import sharp from 'sharp';
import * as streamifier from 'streamifier';
import { Readable } from 'stream';
interface CloudinaryImageMetadata {
  secure_url: string;
  public_id: string;
  url: string;
  // Any other fields you need from the metadata
}
@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(imageBuffer: Buffer, fileName: string): Promise<any> {
    // Compress and resize the image using Sharp
    const compressedImage = await sharp(imageBuffer)
      .resize(800, 600) // Optional: Resize the image before uploading (adjust as needed)
      .toBuffer();

    // Upload the image to Cloudinary
    return new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        {
          public_id: fileName,
          folder: 'properties', // Folder in Cloudinary (optional)
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        },
      );

      // Convert buffer to stream and pipe to Cloudinary
      streamifier.createReadStream(compressedImage).pipe(stream);
    });
  }

  async deleteImage(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.destroy(publicId, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      });
    });
  }
}
