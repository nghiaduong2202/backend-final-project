import { ApiProperty } from '@nestjs/swagger';
import { PaymentTypeEnum } from '../enums/payment-type.enum';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class PaymentDto {
  @ApiProperty({
    type: 'string',
    example: PaymentTypeEnum.ONLINE,
  })
  @IsEnum(PaymentTypeEnum)
  @IsNotEmpty()
  paymentType: PaymentTypeEnum;

  @ApiProperty({
    type: 'number',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  voucherId?: number;
}
