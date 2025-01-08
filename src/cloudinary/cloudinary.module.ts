import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';  // Ensure correct path

@Module({
  providers: [CloudinaryService],
  exports: [CloudinaryService],  // Export CloudinaryService to be available in other modules
})
export class CloudinaryModule {}
