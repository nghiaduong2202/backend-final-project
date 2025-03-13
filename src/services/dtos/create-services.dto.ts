import { ApiProperty } from '@nestjs/swagger';
import { CreateServiceDto } from './create-service.dto';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateServicesDto {
  @ApiProperty({
    type: 'array',
    example: [
      {
        name: 'Service name',
        price: 10000,
        description: 'Service description',
        amount: 20,
        sportId: 1,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceDto)
  servicesData: CreateServiceDto[];
}
