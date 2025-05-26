import { IsNotEmpty, IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateAddressDto {
    @IsString()
    @ApiProperty({ example: 'casjhckjsbfvc' })
    adressId: string

    @IsString()
    @ApiProperty({ example: '123 Main St' })
    adress: string;

    @IsString()
    @ApiProperty({ example: '10001' })
    postCode: string;



    @IsString()
    @ApiProperty({ example: 122 })
    plate : number


    @IsString()
    @ApiProperty({ example: 1 })
    unit : number


}
