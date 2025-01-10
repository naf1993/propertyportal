import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  UploadedFile,
  UseInterceptors,
  Req,
  Patch,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePropertyDto, UpdatePropertyDto } from './property.dto';
import { Property } from './property.schema';
import { Request } from 'express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import sharp from 'sharp';

@Controller('properties')
export class PropertyController {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() propertyDto: CreatePropertyDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    if (file) {
      try {
        const compressedImage = await sharp(file.buffer)
          .resize(800)
          .toFormat('jpeg', { quality: 80 })
          .toBuffer();

        const uploadResult = await this.cloudinaryService.uploadImage(
          compressedImage,
          file.originalname,
        );
        propertyDto.image = uploadResult.secure_url;
      } catch (error) {
        console.error('Error processing and uploading image:', error);
        throw new Error('Error processing and uploading the image.');
      }
    }

    return await this.propertyService.create(propertyDto);
  }

  @Get()
  async getProperties(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    if (page === undefined || limit === undefined) {
      return await this.propertyService.getAllProperties();
    }
    return await this.propertyService.getProperties(page, limit);
  }

  @Get(':id')
  async getProperty(@Param('id') id: string): Promise<Property> {
    return this.propertyService.getPropertyById(id);
  }

  @Patch(':id') @UseInterceptors(FileInterceptor('image')) async updateProperty(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Property> {
    if (file) {
      console.log('file present');
    }
    return this.propertyService.updateProperty(id, updatePropertyDto);
  }

  @Delete(':id')
  async deleteProperty(@Param('id') id: string): Promise<void> {
    return await this.propertyService.deleteProperty(id);
  }
}
