import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateFieldDto {
  @ApiProperty({
    type: 'string',
    example: 'Field name',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    type: 'number',
    example: 100000,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    type: 'string',
    example: '100x100',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  demenstion: string;

  @ApiProperty({
    type: 'array',
    example: [1],
  })
  @IsArray()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  sportIds: number[];
}
