import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateBookingSlotDto {
  @ApiProperty({
    type: 'string',
    example: '2025-03-12',
  })
  @IsDateString()
  @IsNotEmpty()
  @Type(() => Date)
  date: Date;

  @ApiProperty({
    type: 'number',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  fieldId: number;
}
