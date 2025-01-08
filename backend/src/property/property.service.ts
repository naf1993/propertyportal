import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property } from './property.schema';
import * as fs from 'fs';
import * as path from 'path';
import { randomInt } from 'crypto';
import { properties } from 'data';
import { CreatePropertyDto, UpdatePropertyDto } from './property.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel('Property') private propertyModel: Model<Property>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createProperties() {
    // Clear the existing properties before insertion
    await this.propertyModel.deleteMany({});
    console.log('Cleared existing properties from the database.');

    const imageFolderPath = path.join(process.cwd(), 'images');
    console.log('Images folder path:', imageFolderPath);

    if (!fs.existsSync(imageFolderPath)) {
      console.error('Images folder does not exist at path:', imageFolderPath);
      return;
    }

    const imageFiles = fs.readdirSync(imageFolderPath);
    console.log('Image Files:', imageFiles); // Log the list of image files

    const newProperties = await Promise.all(
      properties.map(async (property, index) => {
        console.log(`Processing property ${index + 1}: ${property.title}`);
        const randomImageIndex = randomInt(0, imageFiles.length);
        const selectedImage = imageFiles[randomImageIndex];
        console.log(`Selected image: ${selectedImage}`);

        const imagePath = path.join(imageFolderPath, selectedImage);
        console.log(`Uploading image from ${imagePath} to Cloudinary`);

        // Read the image file and upload to Cloudinary
        const imageBuffer = fs.readFileSync(imagePath);
        const uploadResult = await this.cloudinaryService.uploadImage(
          imageBuffer,
          selectedImage,
        );

        return {
          ...property,
          image: uploadResult.secure_url, // Use the URL returned from Cloudinary
        };
      }),
    );

    console.log(
      'Inserting new properties into the database:',
      newProperties.length,
    );
    const result = await this.propertyModel.insertMany(newProperties);
    console.log('Inserted properties:', result.length);
    return result;
  }

  async create(propertyDto: CreatePropertyDto) {
    const createdProperty = new this.propertyModel(propertyDto);
    return await createdProperty.save(); // Save to MongoDB
  }

  async getAllProperties() {
    const properties = await this.propertyModel
      .find()
      .sort({ createdAt: -1 })
      .exec();

    return {
      properties,
      totalProperties: properties.length,
      page: 1,
      totalPages: 1,
    };
  }

  async getProperties(page: number, limit: number) {
    // Ensure page number is within bounds
    const validPage = page < 1 ? 1 : page;
    const skip = (validPage - 1) * limit;

    const totalProperties = await this.propertyModel.countDocuments();
    const totalPages = Math.ceil(totalProperties / limit);

    // Ensure requested page doesn't exceed total pages
    const finalPage = validPage > totalPages ? totalPages : validPage;

    const properties = await this.propertyModel
      .find()
      .sort({ createdAt: -1 })
      .skip((finalPage - 1) * limit)
      .limit(limit)
      .exec();

    return {
      properties,
      totalProperties,
      page: finalPage, // Return the correct page
      totalPages,
    };
  }

  async getPropertyById(id: string): Promise<Property> {
    const property = await this.propertyModel.findById(id).exec();
    if (!property) {
      throw new NotFoundException(`Property with id ${id} not found`);
    }
    return property;
  }

  async updateProperty(
    id: string,
    updateData: UpdatePropertyDto,
  ): Promise<Property> {
    const property = await this.propertyModel.findById(id);
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    console.log('recieved updated data', updateData);
    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('No Fields present');
    }
    if (updateData.coordinates && typeof updateData.coordinates === 'string') {
      try {
        const parsedCoordinates = JSON.parse(updateData.coordinates);
        if (parsedCoordinates.type && parsedCoordinates.coordinates) {
          updateData.coordinates = parsedCoordinates;
        } else {
          throw new Error('Invalid coordinates format');
        }
      } catch (error) {
        throw new BadRequestException('Invalid coordinates format');
      }
    }
    Object.assign(property, updateData);
    console.log('updated property', property);
    await property.save();
    return property;
  }

  async deleteProperty(id: string): Promise<void> {
    const property = await this.propertyModel.findById(id);
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    const publicId = property.image.split('/').pop().split('.')[0];
    await this.propertyModel.findByIdAndDelete(id);
    await this.cloudinaryService.deleteImage(publicId);
    console.log('Deleted property and associated image:', property);
  }
}

// Create a property
