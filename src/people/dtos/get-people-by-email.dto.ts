import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class GetPeopleByEmailDto {
  @ApiProperty({
    type: 'string',
    example: 'nghiaduong2202@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
