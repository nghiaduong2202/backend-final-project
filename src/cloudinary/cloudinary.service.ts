import { Injectable } from '@nestjs/common';
import { UploadImageProvider } from './providers/upload-image.provider';

@Injectable()
export class CloudinaryService {
  constructor(
    /**
     * inject upload image provider
     */
    private readonly uploadImageProvider: UploadImageProvider,
  ) {}

  public async uploadImage(file: Express.Multer.File) {
    return await this.uploadImageProvider.uploadImage(file);
  }
}
