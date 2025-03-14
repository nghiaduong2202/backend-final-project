import { VoucherTypeEnum } from '../enums/voucher-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateVoucherDto {
  @ApiProperty({
    type: 'string',
    example: 'KHAI TRUONG CS 1',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    type: 'string',
    example: 'obxmd',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  code: string;

  @ApiProperty({
    type: 'string',
    example: '2025-03-12T00:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startTime: Date;

  @ApiProperty({
    type: 'string',
    example: '2025-04-12T00:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  endTime: Date;

  @ApiProperty({
    type: 'string',
    enum: VoucherTypeEnum,
    example: VoucherTypeEnum.CASH,
  })
  @IsEnum(VoucherTypeEnum)
  @IsNotEmpty()
  voucherType: VoucherTypeEnum;

  @ApiProperty({
    type: 'number',
    example: 20000,
  })
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @ApiProperty({
    type: 'number',
    example: 100000,
  })
  @IsNotEmpty()
  @IsNumber()
  minPrice: number;

  @ApiProperty({
    type: 'number',
    example: 20000,
  })
  @IsNumber()
  @IsNotEmpty()
  maxDiscount: number;

  @ApiProperty({
    type: 'number',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
