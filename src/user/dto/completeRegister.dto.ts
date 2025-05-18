import { IsNotEmpty, IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
export class AddressDto {
    @IsString()
    @ApiProperty({ example: '123 Main St' })
    adress: string;
  
    @IsString()
    @ApiProperty({ example: '10001' })
    postCode: string;
  }

export class compelteRegisterDto{

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example : 'Ali',
        required : true
    })
    firstName : string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example : 'mohammadi',
        required : true
    })
    lastName : string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example : 'ebrahim',
        required : true
    })
    fatherName : string


    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example : 'ali@moahamadi@gmail.com',
        required : true
    })
    email : string


    @ApiProperty({
        type: [AddressDto],
        example: [
          {
            adress: '123 Main St',
            postCode: '10001',
          },
          {
            adress: '456 Oak Ave',
            postCode: '90210',
          },
        ],
      })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  adresses: AddressDto[];





}


