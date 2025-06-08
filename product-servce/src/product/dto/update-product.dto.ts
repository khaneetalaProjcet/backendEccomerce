
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsNumber, IsMongoId } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({ example: 'Gold Ring', description: 'Name of the product' })
  @IsString()
  @IsNotEmpty()
  name?: string;
  @ApiProperty({ example: ['image1.jpg', 'image2.jpg'], description: 'List of image URLs or paths', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
  @ApiProperty({ example: 'High-quality gold product', description: 'Description of the product' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'High-quality gold product', description: 'Description of the product' })
  @IsString()
  @IsOptional()
  mainImage?: string;

  @ApiProperty({ example: 150, description: 'Wages associated with the product' })
  @IsNumber()
  wages: number;
  @ApiProperty({ example: '60f7a1b3b5d4b32f884d8a5e', description: 'ID of the product category' })
  @IsMongoId()
  firstCategory: string;
  @ApiProperty({ example: '60f7a1b3b5d4b32f884d8a5e', description: 'ID of the product category' })
  @IsMongoId()
  midCategory?: string;
  @ApiProperty({ example: '60f7a1b3b5d4b32f884d8a5e', description: 'ID of the product category' })
  @IsMongoId()
  lastCategory?: string;
  


}
