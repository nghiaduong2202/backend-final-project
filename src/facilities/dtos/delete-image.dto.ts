import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class DeleteImageDto {
  @ApiProperty({
    type: 'string',
    example:
      'https://res.cloudinary.com/db3dx1dos/image/upload/v1741693263/dwwixxtnfzdh2trxhqdr.jpg',
  })
  @IsUrl()
  @IsNotEmpty()
  image: string;
}
