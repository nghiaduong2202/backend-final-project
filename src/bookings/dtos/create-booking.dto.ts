import { PaymentTypeEnum } from '../enums/payment-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsMilitaryTime,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BookingServicesDto } from './booking-services.dto';

export class CreateBookingDto {
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
    type: 'string',
    example: PaymentTypeEnum.ONLINE,
  })
  @IsNotEmpty()
  @IsEnum(PaymentTypeEnum)
  paymentType: PaymentTypeEnum;

  @ApiProperty({
    type: 'number',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  fieldId: number;

  @ApiProperty({
    type: 'string',
    example: '',
  })
  @IsOptional()
  // @IsUUID()
  @IsNumber()
  voucherId?: number;

  @ApiProperty({
    type: 'array',
    example: [
      {
        serviceId: 1,
        amount: 2,
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingServicesDto)
  bookingServicesData?: BookingServicesDto[];
}
