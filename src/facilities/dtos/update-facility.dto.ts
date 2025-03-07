import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDraftDto } from './create-draft.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateFacilityDto extends PartialType(CreateDraftDto) {
  @ApiProperty({
    type: 'number',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
