import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';
import { UploadImageProvider } from './providers/upload-image.provider';

@Module({
  providers: [
    CloudinaryService,
    UploadImageProvider,
    {
      provide: 'CLOUDINARY',
      useFactory: () => {
        return cloudinary.config({
          cloud_name: process.env.CLOUDINARY_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });
      },
    },
  ],
  exports: [CloudinaryService],
  controllers: [],
})
export class CloudinaryModule {}
