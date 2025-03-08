import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateFieldGroupDto } from 'src/field-groups/dtos/create-field-group.dto';

export class CreateFacilityDto {
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

  @ApiProperty({
    type: 'array',
    example: [
      {
        dimension: '120x240',
        surface: 'mặt cỏ',
        basePrice: 100000,
        peakStartTime: '18:00',
        peakEndTime: '21:00',
        priceIncrease: 50000,
        sportIds: [1, 2],
        fieldsData: [{ name: 'field name' }],
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFieldGroupDto)
  fieldGroupsData: CreateFieldGroupDto[];
}
