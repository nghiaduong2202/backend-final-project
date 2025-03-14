import { ApiProperty } from '@nestjs/swagger';
import { IsMilitaryTime, IsNotEmpty, IsNumber } from 'class-validator';

export class GetAvailabilityServiceInFacilityDto {
  @ApiProperty({
    type: 'number',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
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
}
