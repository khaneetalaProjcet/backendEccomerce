import { IsNotEmpty, IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddressDto {
    @IsString()
    @ApiProperty({ example: '123 Main St' })
    adress: string;
  
    @IsString()
    @ApiProperty({ example: '10001' })
    postCode: string;
}
