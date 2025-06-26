import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  persianName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  englishName: string;
}
