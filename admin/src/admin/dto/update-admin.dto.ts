import { PartialType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString,IsNotEmpty,IsEmail,IsOptional } from 'class-validator';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  fatherName?: string;

}
