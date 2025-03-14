import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class BookingServicesDto {
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  serviceId: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  amount: number;
}
