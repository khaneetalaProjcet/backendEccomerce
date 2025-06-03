import { ApiProperty } from '@nestjs/swagger';
import {  IsNotEmpty, IsOptional, IsString, IsNumber, IsMongoId } from 'class-validator';

export class UpdateProductItemDto {
  
  @ApiProperty({ example: '2xl', description: 'size of item' })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiProperty({ example: 'yellow', description: 'Color of the product' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ example: "1.002", description: 'weight if the  product' })
  @IsString()
  @IsOptional()
  weight?: string;

  @ApiProperty({ example: 100, description: 'Count of this items' })
  @IsNumber()
  @IsOptional()
  count?: number;
}
