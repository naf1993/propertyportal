import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property } from './property.schema';
import { CreatePropertyDto, UpdatePropertyDto } from './property.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { User } from 'src/user/user.schema';
import { ElasticsearchService } from 'src/elasticsearch/elasticsearch.service';

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel('Property') private propertyModel: Model<Property>,
    @InjectModel('User') private userModel: Model<User>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly elasticSearchService: ElasticsearchService,
  ) {
    // // Initialize Redis client
    // this.redis = new Redis({
    //   host: '127.0.0.1', // Make sure this matches your Redis configuration
    //   port: 6379, // Default Redis port
    //   db: 0,
    // });
  }

  // // Generate cache key for properties based on pagination and filters
  // private generateCacheKey(page: number, limit: number, filters: any): string {
  //   const filterString = JSON.stringify(filters);
  //   return `properties:${page}:${limit}:${filterString}`;
  // }

  // async createProperties() {
  //   const imageFolderPath = path.join(process.cwd(), 'images');
  //   console.log('Images folder path:', imageFolderPath);

  //   if (!fs.existsSync(imageFolderPath)) {
  //     console.error('Images folder does not exist at path:', imageFolderPath);
  //     return;
  //   }

  //   const imageFiles = fs.readdirSync(imageFolderPath);
  //   console.log('Image Files:', imageFiles); // Log the list of image files

  //   const newProperties = await Promise.all(
  //     properties.map(async (property, index) => {
  //       console.log(`Processing property ${index + 1}: ${property.title}`);
  //       const randomImageIndex = randomInt(0, imageFiles.length);
  //       const selectedImage = imageFiles[randomImageIndex];
  //       console.log(`Selected image: ${selectedImage}`);

  //       const imagePath = path.join(imageFolderPath, selectedImage);
  //       console.log(`Uploading image from ${imagePath} to Cloudinary`);

  //       // Read the image file and upload to Cloudinary
  //       const imageBuffer = fs.readFileSync(imagePath);
  //       const uploadResult = await this.cloudinaryService.uploadImage(
  //         imageBuffer,
  //         selectedImage,
  //       );

  //       return {
  //         ...property,
  //         image: uploadResult.secure_url, // Use the URL returned from Cloudinary
  //       };
  //     }),
  //   );

  //   console.log(
  //     'Inserting new properties into the database:',
  //     newProperties.length,
  //   );
  //   const result = await this.propertyModel.insertMany(newProperties);
  //   console.log('Inserted properties:', result.length);
  //   return result;
  // }

  // Create a property
  async create(propertyDto: CreatePropertyDto, user: any) {
    console.log('hello');
    if (user.role !== 'admin' && user.role !== 'agent') {
      throw new BadRequestException(
        'You do not have permission to create a property.',
      );
    }
    const createdProperty = new this.propertyModel({
      ...propertyDto,
      listingAgent: user._id, // Associate the logged-in user as the owner
    });
    const savedProperty = await createdProperty.save();

    // Invalidate cache after creating a property
    // await this.invalidateCacheForProperties();

    return savedProperty;
  }

  // Get all properties (no filters)
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

  // Get properties with filters, pagination, and caching
  async getProperties(
    page: number,
    limit: number,
    filters: any
  ) {
    if (filters?.textQuery && filters?.textQuery?.length > 10) {
    
      let elasticSearchQuery = filters.textQuery
      return this.elasticSearchService.searchProperties(
        elasticSearchQuery,
        page,
        limit,
        filters,
      );
    } else {
      const query: any = {};

      if (filters.propertyType) {
        query.propertyType = { $regex: new RegExp(filters.propertyType, 'i') };
      }
      if (filters.minPrice) {
        query.price = { $gte: Number(filters.minPrice) };
      }
      if (filters.maxPrice) {
        query.price = query.price || {}; // Allow both min and max price filters together
        query.price.$lte = Number(filters.maxPrice);
      }
      if (filters.city) {
        query.city = { $regex: new RegExp(filters.city, 'i') }; // Case insensitive search
      }

      if (filters.bedrooms) {
        query.bedrooms = { $gte: Number(filters.bedrooms) };
        console.log(typeof query.bedrooms);
      }

      if (filters.latitude && filters.longitude) {
        const lat = parseFloat(filters.latitude);
        const lng = parseFloat(filters.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          const radiusInKm = 20;
          const radiusInRadians = radiusInKm / 6371;
          query.coordinates = {
            $geoWithin: {
              $centerSphere: [[lat, lng], radiusInRadians],
            },
          };
        } else {
          console.error('Invalid locations');
          throw new BadRequestException('Invalid location');
        }
      }
      console.log('this is query', query);
      // Count total number of properties that match the filters
      const totalProperties = await this.propertyModel.countDocuments(query);
      const totalPages = Math.ceil(totalProperties / limit);

      // Ensure requested page doesn't exceed total pages
      const validPage = page < 1 ? 1 : page;
      const skip = (validPage - 1) * limit;
      console.log(page)
      console.log(limit)

      // Retrieve the filtered and paginated properties
      console.log('this is query', query);
      const properties = await this.propertyModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();

      const result = {
        properties,
        totalProperties,
        page: validPage,
        totalPages,
      };
      console.log('this is result properites length', totalProperties);

      // Cache the result
      // await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 60);

      return result;
    }
  }

  // Get a single property by ID
  async getPropertyById(id: string): Promise<Property> {
    const property = await this.propertyModel.findById(id).exec();
    if (!property) {
      throw new NotFoundException(`Property with id ${id} not found`);
    }
    return property;
  }

  // Update a property
  async updateProperty(
    id: string,
    updateData: UpdatePropertyDto,
    user: any,
  ): Promise<Property> {
    const property = await this.propertyModel
      .findById(id)
      .populate('listingAgent')
      .exec();
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    // if (user.role !== 'admin' && property.listingAgent.toString() !== user._id.toString()) {
    //   throw new BadRequestException('You do not have permission to update this property.');
    // }

    console.log('Received update data:', updateData);

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('No fields to update');
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
    let updated = { ...updateData, listingAgent: user._id };

    Object.assign(property, updated);
    await property.save();

    // // Invalidate cache after updating a property
    // await this.invalidateCacheForProperties();

    return property;
  }

  // Delete a property
  async deleteProperty(id: string, user: any): Promise<void> {
    const property = await this.propertyModel
      .findById(id)
      .populate('listingAgent')
      .exec();
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // if (user.role !== 'admin' && property.listingAgent.toString() !== user._id.toString()) {
    //   throw new BadRequestException('You do not have permission to update this property.');
    // }

    // Delete image from Cloudinary (if any)
    const imageUrl = property?.image;
    if (imageUrl) {
      const publicId = imageUrl.split('/').pop()?.split('.')[0];
      if (publicId) {
        await this.cloudinaryService.deleteImage(publicId);
      }
    }

    // Delete the property from the database
    await this.propertyModel.findByIdAndDelete(id);

    // // Invalidate cache after deleting a property
    // await this.invalidateCacheForProperties();
  }

  // Invalidate cache for all properties
  // private async invalidateCacheForProperties() {
  //   const keys = await this.redis.keys('properties:*');
  //   if (keys.length > 0) {
  //     await this.redis.del(...keys);
  //     console.log('Invalidated all property cache keys');
  //   }
  // }

  // // Invalidate cache for a specific filter combination (more granular invalidation)
  // private async invalidateCacheForFilters(filters: any) {
  //   const cacheKey = this.generateCacheKey(
  //     filters.page,
  //     filters.limit,
  //     filters,
  //   );
  //   await this.redis.del(cacheKey); // Delete cache for this specific filter
  //   console.log(`Invalidated cache for key: ${cacheKey}`);
  // }

  async getPropertiesByAgent(agentId: string): Promise<Property[]> {
    const agent = await this.userModel.findById(agentId);
    if (!agent || agent.role !== 'agent') {
      throw new NotFoundException('Agent not found or not an agent');
    }
    return this.propertyModel.find({ listingAgent: agentId }).exec();
  }
}
