import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateAdditionalServiceDto {
  @ApiProperty({
    type: 'number',
    example: '1',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  serviceId: number;

  @ApiProperty({
    type: 'number',
    example: '2',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;
}
