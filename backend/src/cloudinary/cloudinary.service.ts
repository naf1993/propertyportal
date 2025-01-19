// cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';
import * as streamifier from 'streamifier';

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
    try {
      // Upload the image to Cloudinary
      return new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          {
            public_id: fileName,
            folder: 'properties', // Folder in Cloudinary (optional)
          },
          (error, result) => {
            if (error) {
              console.error('Error uploading image to Cloudinary:', error);
              return reject(error);
            }
            console.log('Image uploaded to Cloudinary:', result);
            resolve(result);
          },
        );

        // Convert buffer to stream and pipe to Cloudinary
        streamifier.createReadStream(imageBuffer).pipe(stream);
      });
    } catch (error) {
      console.error('Error processing and uploading image:', error);
      throw new Error('Error processing and uploading the image.');
    }
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
