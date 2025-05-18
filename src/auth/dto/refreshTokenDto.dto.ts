import { IsNotEmpty, IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class refreshTokenDto{

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example : '0922905555',
        required : true
    })
    refreshToken : string

}


