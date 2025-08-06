import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class createMetadataProductDto {
  @ApiProperty({
    example: '',
    description: 'meta decription for description field in product model',
  })
  @IsString()
  @IsNotEmpty()
  metaDescription: string;

  @ApiProperty({
    example: '',
    description: 'meta title for title field in product model',
  })
  @IsString()
  @IsOptional()
  metaTitle?: string;
}
