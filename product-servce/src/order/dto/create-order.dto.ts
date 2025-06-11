import {IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderAddressDto {
  @IsString()
  @IsNotEmpty()
  addressId: string;

  @IsString()
  @IsNotEmpty()
  adress: string;

  @IsString()
  @IsNotEmpty()
  postCode: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  plate: number;

  @IsNumber()
  @IsNotEmpty()
  unit: number;
}

export class CreateOrderDto {
  @ValidateNested()
  @Type(() => OrderAddressDto)
  address: OrderAddressDto;
}
