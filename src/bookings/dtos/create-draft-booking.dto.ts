import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsMilitaryTime,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDraftBookingDto {
  @ApiProperty({
    type: 'string',
    example: '06:00',
  })
  @IsMilitaryTime()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({
    type: 'string',
    example: '08:00',
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

  @ApiProperty({
    type: 'number',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  fieldId: number;

  @ApiProperty({
    type: 'number',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  sportId: number;
}
