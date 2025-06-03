import { ApiProperty } from '@nestjs/swagger';
import {  IsNotEmpty, IsOptional, IsString, IsNumber, IsMongoId } from 'class-validator';

export class CreateProductItemDto {
  @ApiProperty({ example: '60f7a1b3b5d4b32f884d8a5e', description: 'Id of the product' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: '2xl', description: 'size of item' })
  @IsString()
  @IsNotEmpty()
  size: string;

  @ApiProperty({ example: 'yellow', description: 'Color of the product' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ example: "1.002", description: 'weight if the  product' })
  @IsString()
  @IsNotEmpty()
  weight: string;

  @ApiProperty({ example: 100, description: 'Count of this items' })
  @IsNumber()
  @IsOptional()
  cout?: number;
}
