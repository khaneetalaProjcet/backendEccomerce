import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Updated Category Name', description: 'New name of the category' })
  @IsOptional()
  @IsString()
  name?: string;
  @ApiPropertyOptional({ example: 'Updated Category Description', description: 'New description of the category' })
  @IsOptional()
  @IsString()
  description?: string;
}