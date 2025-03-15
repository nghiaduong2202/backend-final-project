import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class BookingServiceDto {
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  serviceId: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  amount: number;
}
