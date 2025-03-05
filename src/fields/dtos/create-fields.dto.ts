import { ApiProperty } from '@nestjs/swagger';
import { CreateFieldDto } from './create-field.dto';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFieldsDto {
  @ApiProperty({
    type: 'array',
    example: [
      {
        name: 'Field name',
        price: 100000,
        demenstion: '100x100',
        sportIds: [1, 2],
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFieldDto)
  @IsNotEmpty()
  fields: CreateFieldDto[];

  @ApiProperty({
    type: 'number',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  facilityId: number;
}
