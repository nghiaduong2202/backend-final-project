import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateFieldGroupDto } from './create-field-group.dto';

export class CreateFieldGroupsDto {
  @ApiProperty({
    type: 'array',
    example: [
      {
        name: 'Field group name',
        dimension: '120x240',
        surface: 'mặt cỏ',
        basePrice: 100000,
        peakStartTime: '18:00',
        peakEndTime: '21:00',
        priceIncrease: 50000,
        sportIds: [1, 2],
        fieldsData: [{ name: 'field name' }],
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFieldGroupDto)
  fieldGroupsData: CreateFieldGroupDto[];
}
