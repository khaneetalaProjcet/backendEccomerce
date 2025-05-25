import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { ApiBody, ApiOperation, ApiResponse , } from '@nestjs/swagger';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}
   @ApiOperation({ summary: 'create wallet for user' })
    @ApiResponse({
      status: 200, description: 'the otp code sent successfully',
      schema: {
        example: {
          success: true,
          message: 'کد تایید موفق',
          error: null,
          data: null
        }
      },
    })
    @ApiResponse({
      status: 409, description: 'duplicate data',
      schema: {
        example: {
          success: false,
          message: 'this code already sendt',
          error: 'duplicate sent code',
          data: null
        }
      },
    })
    @ApiResponse({
      status: 500, description: 'internal service error',
      schema: {
        example: {
          success: false,
          message: 'internal error',
          error: 'internal service error',
          data: null
        }
      },
    })
    @ApiBody({
      type: CreateWalletDto,
      description: 'Json structure for project object',
    })
  @Post()
   create(@Body() createWalletDto: CreateWalletDto) {
    console.log("from user service",createWalletDto);
    
    return this.walletService.create(createWalletDto);

  
  }

  @Get()
  findAll() {
    return this.walletService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto) {
    return this.walletService.update(+id, updateWalletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletService.remove(+id);
  }
}
