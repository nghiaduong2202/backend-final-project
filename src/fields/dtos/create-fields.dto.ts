import { ApiProperty } from '@nestjs/swagger';
import { CreateFieldDto } from './create-field.dto';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFieldsDto {
  @ApiProperty({
    type: 'array',
    example: [
      {
        name: 'Field name',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFieldDto)
  @IsNotEmpty()
  fieldsData: CreateFieldDto[];
}
