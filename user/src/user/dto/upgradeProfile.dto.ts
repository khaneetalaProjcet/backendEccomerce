import { IsNotEmpty, IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class upgradeProfileDto{

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


   





}


