import { ApiProperty } from '@nestjs/swagger';
import {
  IsMilitaryTime,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateFacilityDto {
  @ApiProperty({
    type: 'string',
    example: 'Facility name',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(255)
  name?: string;

  @ApiProperty({
    type: 'string',
    example: 'Facility description',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: 'string',
    example: '6:00',
    nullable: true,
  })
  @IsString()
  @IsMilitaryTime()
  @IsOptional()
  openTime1?: string;

  @ApiProperty({
    type: 'string',
    example: '22:00',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @IsMilitaryTime()
  closeTime1?: string;

  @ApiProperty({
    type: 'string',
    example: '6:00',
    nullable: true,
  })
  @IsString()
  @IsMilitaryTime()
  @IsOptional()
  openTime2?: string;

  @ApiProperty({
    type: 'string',
    example: '22:00',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @IsMilitaryTime()
  closeTime2?: string;

  @ApiProperty({
    type: 'string',
    example: '6:00',
    nullable: true,
  })
  @IsString()
  @IsMilitaryTime()
  @IsOptional()
  openTime3?: string;

  @ApiProperty({
    type: 'string',
    example: '22:00',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @IsMilitaryTime()
  closeTime3?: string;

  @ApiProperty({
    type: 'string',
    example: 'Facility location',
  })
  @IsString()
  @IsOptional()
  location?: string;
}
