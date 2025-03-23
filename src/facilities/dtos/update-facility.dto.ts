import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateFacilityDto {
  @ApiProperty({
    type: 'string',
    required: false,
    example: 'Facility name',
  })
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(255)
  name?: string;

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
  @IsOptional()
  openTime?: string;

  @ApiProperty({
    type: 'string',
    example: '22:00',
  })
  @IsString()
  @IsOptional()
  closeTime?: string;

  @ApiProperty({
    type: 'string',
    example: 'Facility location',
  })
  @IsString()
  @IsOptional()
  location?: string;
}
