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
  UseGuards,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePropertyDto, UpdatePropertyDto } from './property.dto';
import { Property } from './property.schema';
import { Request } from 'express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import sharp from 'sharp';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';


@Controller('properties')
export class PropertyController {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard,new RolesGuard(['admin', 'agent']))
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() propertyDto: CreatePropertyDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);
    const user = req.user

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

    return await this.propertyService.create(propertyDto,user);
  }

  @Get()
  async getProperties(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query() filters?:any
  ) {
    if (page === undefined || limit === undefined || filters === undefined) {
      return await this.propertyService.getAllProperties();
    }
    return await this.propertyService.getProperties(page, limit,filters);
  }

  @Get(':id')
  async getProperty(@Param('id') id: string): Promise<Property> {
    return this.propertyService.getPropertyById(id);
  }

  @Patch(':id') @UseGuards(JwtAuthGuard,new RolesGuard(['admin', 'agent'])) @UseInterceptors(FileInterceptor('image')) async updateProperty(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @UploadedFile() file: Express.Multer.File,@Req() req:Request
  ): Promise<Property> {
  const user = req.user
    if (file) {
      console.log('file present');
    }
    return this.propertyService.updateProperty(id, updatePropertyDto,user);
  }

  @Delete(':id')@UseGuards(JwtAuthGuard,new RolesGuard(['admin', 'agent']))
  async deleteProperty(@Param('id') id: string,@Req() req:Request): Promise<void> {
    const user = req.user
    return await this.propertyService.deleteProperty(id,user);
  }
}
