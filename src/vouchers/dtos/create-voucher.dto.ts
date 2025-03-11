import { UUID } from 'crypto';
import { VoucherTypeEnum } from '../enums/voucher-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateVoucherDto {
  @ApiProperty({
    type: 'string',
    example: '4d5a3210-5ad4-46a7-903f-a34c6267c665',
  })
  @IsUUID()
  @IsNotEmpty()
  facilityId: UUID;

  @ApiProperty({
    type: 'number',
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  sportId: number;

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
    example: '2025-03-11 01:07:06.642',
  })
  @IsDateString()
  @IsNotEmpty()
  startTime: Date;

  @ApiProperty({
    type: 'string',
    example: '2025-03-11 01:07:06.642',
  })
  @IsDateString()
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
