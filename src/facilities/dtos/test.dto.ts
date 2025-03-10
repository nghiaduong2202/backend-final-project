import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TestDto {
  @ApiProperty({
    type: 'string',
    example: 'Facility name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: 'string',
    example: 'Facility description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
