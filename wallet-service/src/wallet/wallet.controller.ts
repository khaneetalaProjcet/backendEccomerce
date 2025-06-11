import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  UseGuards,
  // UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}
  @ApiOperation({ summary: 'create wallet for user' })
  @ApiResponse({
    status: 200,
    description: 'the otp code sent successfully',
    schema: {
      example: {
        success: true,
        message: 'کد تایید موفق',
        error: null,
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'duplicate data',
    schema: {
      example: {
        success: false,
        message: 'this code already sendt',
        error: 'duplicate sent code',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'internal service error',
    schema: {
      example: {
        success: false,
        message: 'internal error',
        error: 'internal service error',
        data: null,
      },
    },
  })
  @ApiBody({
    type: CreateWalletDto,
    description: 'Json structure for project object',
  })

  @Post()
  // @UseGuards(JwtAuthGuard)
  create(@Body() createWalletDto: CreateWalletDto) {
    console.log('from user service', createWalletDto);
    return this.walletService.create(createWalletDto);
  }

  @Get('/find')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'get wallet for user' })
  @ApiResponse({
    status: 200,
    description: 'get user wallet done',
    schema: {
      example: {
        success: true,
        message: ' کیف پول کاربر ',
        error: null,
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'duplicate data',
    schema: {
      example: {
        success: false,
        message: 'this code already sendt',
        error: 'duplicate sent code',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'internal service error',
    schema: {
      example: {
        success: false,
        message: 'internal error',
        error: 'internal service error',
        data: null,
      },
    },
  })
  findSpecificWallet(@Req() req: any, @Res() res: any) {
    return this.walletService.findSpecificUserWallet(req, res);
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

  @Post('/pay/:orderId')
  async payTheOrder(@Req() req : any , @Res() res : any , @Param('orderId') orderId :string){
    
  }



}
