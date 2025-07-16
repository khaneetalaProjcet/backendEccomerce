import { IsNotEmpty, IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNumber, ValidateNested } from "class-validator";


export class CreateWalletDto{

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example : 'agcas324vsdv324',
        required : true
    })
    owner : string

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        example : 0,
        required : true
    })
     balance: number

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example : '1.00',
        required : true
    })
    goldWeight : string


  


}


