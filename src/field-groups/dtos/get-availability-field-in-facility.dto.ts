import { ApiProperty } from '@nestjs/swagger';
import { IsMilitaryTime, IsNotEmpty, IsNumber } from 'class-validator';

export class GetAvailabilityFieldInFacilityDto {
  @ApiProperty({
    type: 'number',
    example: '1',
  })
  @IsNotEmpty()
  @IsNumber()
  sportId: number;

  @ApiProperty({
    type: 'string',
    example: '08:00',
  })
  @IsNotEmpty()
  @IsMilitaryTime()
  startTime: string;

  @ApiProperty({
    type: 'string',
    example: '10:00',
  })
  @IsNotEmpty()
  @IsMilitaryTime()
  endTime: string;
}
