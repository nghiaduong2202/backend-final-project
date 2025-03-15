import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateFieldBookingDto {
  @ApiProperty({
    type: 'number',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  fieldId: number;
}
