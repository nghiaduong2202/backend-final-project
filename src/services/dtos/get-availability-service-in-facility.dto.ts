import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsMilitaryTime, IsNotEmpty, IsNumber } from 'class-validator';

export class GetAvailabilityServiceInFacilityDto {
  @ApiProperty({
    type: 'number',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  sportId: number;

  @ApiProperty({
    type: 'string',
    example: '08:00',
  })
  @IsMilitaryTime()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({
    type: 'string',
    example: '10:00',
  })
  @IsNotEmpty()
  @IsMilitaryTime()
  endTime: string;

  @ApiProperty({
    type: 'string',
    example: '2025-03-12T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date;
}
