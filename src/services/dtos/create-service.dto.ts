import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    type: 'string',
    example: 'Service name',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    type: 'number',
    example: '10000',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    type: 'string',
    example: 'Service description',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  description?: string;

  @ApiProperty({
    type: 'number',
    example: '20',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    type: 'number',
    example: '1',
  })
  @IsNotEmpty()
  @IsNumber()
  sportId: number;
}
