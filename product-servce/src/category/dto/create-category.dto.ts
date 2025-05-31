import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics', description: 'Name of the category' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: '60f7b2dfc25e4e30f8b51e3a', description: 'Optional parent category ID (for tree structure)' })
  @IsOptional()
  @IsMongoId()
  parent?: string;
}