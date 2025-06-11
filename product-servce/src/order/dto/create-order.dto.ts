import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderAddressDto {
  @ApiProperty({ example: 'addr_123456', description: 'ID of the saved address' })
  @IsString()
  @IsNotEmpty()
  addressId: string;

  @ApiProperty({ example: '123 Main Street, Tehran', description: 'Street address' })
  @IsString()
  @IsNotEmpty()
  adress: string;

  @ApiProperty({ example: '1234567890', description: 'Postal code' })
  @IsString()
  @IsNotEmpty()
  postCode: string;

  @ApiProperty({ example: 'Ali Rezaei', description: 'Full name of the recipient' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 12, description: 'House number or plate' })
  @IsNumber()
  @IsNotEmpty()
  plate: number;

  @ApiProperty({ example: 3, description: 'Unit number (apartment)' })
  @IsNumber()
  @IsNotEmpty()
  unit: number;
}

export class CreateOrderDto {
  @ApiProperty({
    type: OrderAddressDto,
    description: 'Shipping address details',
    example: {
      addressId: 'addr_123456',
      adress: '123 Main Street, Tehran',
      postCode: '1234567890',
      name: 'Ali Rezaei',
      plate: 12,
      unit: 3,
    },
  })
  @ValidateNested()
  @Type(() => OrderAddressDto)
  address: OrderAddressDto;
}
