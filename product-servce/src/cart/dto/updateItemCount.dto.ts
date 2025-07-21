import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateItemCount {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example : ';alsdkfna;ldkfhaj;sdlfk',
        required : true
    })
    item : string

    @IsNotEmpty()
    @IsNumber()
    count : number

}







