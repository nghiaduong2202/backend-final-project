import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAdditionalServiceDto } from 'src/additional-serrvices/dto/create-additional-service.dto';

export class UpdateServiceBookingDto {
  @ApiProperty({
    type: 'array',
    example: [
      {
        serviceId: 1,
        amount: 2,
      },
    ],
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAdditionalServiceDto)
  additionalServices: CreateAdditionalServiceDto[];
}
