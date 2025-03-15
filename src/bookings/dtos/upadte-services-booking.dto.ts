import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BookingServiceDto } from './booking-service.dto';

export class UpdateServiceBookingDto {
  @ApiProperty({
    type: 'array',
    example: [
      {
        serviceId: 1,
        quantity: 2,
      },
    ],
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingServiceDto)
  bookingServicesData: BookingServiceDto[];
}
