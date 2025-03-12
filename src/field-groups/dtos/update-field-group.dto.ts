import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsMilitaryTime,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateFieldGroupDto {
  @ApiProperty({
    type: 'string',
    example: 'Field group name',
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  name?: string;

  @ApiProperty({
    type: 'string',
    example: '120x240',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  dimension?: string;

  @ApiProperty({
    type: 'string',
    example: 'mặt cỏ',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  surface?: string;

  @ApiProperty({
    type: 'number',
    example: 100000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @ApiPropertyOptional({
    type: 'string',
    example: '18:00',
  })
  @IsOptional()
  @IsString()
  @IsMilitaryTime()
  peakStartTime?: string;

  @ApiPropertyOptional({
    type: 'string',
    example: '21:00',
  })
  @IsOptional()
  @IsString()
  @IsMilitaryTime()
  peakEndTime?: string;

  @ApiPropertyOptional({
    type: 'number',
    example: 50000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceIncrease?: number;

  @ApiProperty({
    type: 'array',
    example: [1, 2],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  sportIds: number[];
}
