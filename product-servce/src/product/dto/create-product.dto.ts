import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsMongoId,
  IsObject,
  isObject,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Gold Ring', description: 'Name of the product' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsArray()
  items: any[];

  @ApiProperty({
    example: ['image1.jpg', 'image2.jpg'],
    description: 'List of image URLs or paths',
    type: [String],
  })
  @IsArray()
  @IsOptional()
  images?: { name: string; src: string }[];

  @ApiProperty({
    example: 'High-quality gold product',
    description: 'Description of the product',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'High-quality gold product',
    description: 'Description of the product',
  })
  @IsObject()
  @IsOptional()
  mainImage?: { name: string; src: string };

  @ApiProperty({
    example: 150,
    description: 'Wages associated with the product',
  })
  @IsNumber()
  wages: number;

  @ApiProperty({
    example: 150,
    description: 'Wages associated with the product',
  })
  @IsOptional()
  @IsNumber()
  count?: number;

  @ApiProperty({
    example: '60f7a1b3b5d4b32f884d8a5e',
    description: 'ID of the product category',
  })
  @IsMongoId()
  firstCategory: string | null


  @ApiProperty({
    example: '60f7a1b3b5d4b32f884d8a5e',
    description: 'ID of the product category',
  })
  @IsString()
  midCategory?: string | null


  @ApiProperty({
    example: '60f7a1b3b5d4b32f884d8a5e',
    description: 'ID of the product category',
  })
  @IsString()
  lastCategory?: string | null
}
