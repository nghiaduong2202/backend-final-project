import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateDraftDto {
  @ApiProperty({
    type: 'string',
    example: 'Facility name',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    type: 'string',
    example: 'Facility description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: 'string',
    example: '6:00',
  })
  @IsString()
  @IsNotEmpty()
  openTime: string;

  @ApiProperty({
    type: 'string',
    example: '22:00',
  })
  @IsString()
  @IsNotEmpty()
  closeTime: string;

  @ApiProperty({
    type: 'string',
    example: 'Facility location',
  })
  @IsString()
  @IsNotEmpty()
  location: string;
}
