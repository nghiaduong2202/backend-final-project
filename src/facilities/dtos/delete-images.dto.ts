import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsUrl } from 'class-validator';

export class DeleteImagesDto {
  @ApiProperty({
    type: 'array',
    example: [
      'https://res.cloudinary.com/db3dx1dos/image/upload/v1741693263/dwwixxtnfzdh2trxhqdr.jpg',
    ],
  })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsNotEmpty()
  images: string[];
}
