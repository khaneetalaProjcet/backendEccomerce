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
  Query,
  // UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { walletListQueryDto } from './dto/pagination.dto';

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
    console.log('checking user id', req.user);
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
  async payTheOrder(
    @Req() req: any,
    @Res() res: any,
    @Param('orderId') orderId: string,
  ) {
    return this.walletService.payOrder(orderId);
  }

  @Post('/redirect')
  async redirectFromGateway(
    @Req() req: any,
    @Res() res: any,
    @Body() body: any,
  ) {
    return this.walletService.redirectFromGateway(body);
  }
  
  
  @Post('/secondPay/redirect')
  async secondRedirectFromGateway(
    @Req() req: any,
    @Res() res: any,
    @Body() body: any,
  ) {
    return this.walletService.secondRedirectFromGateway(body);
  }

  @Get('/goldboxInvoices')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retrieve gold box invoices' })
  @ApiResponse({
    status: 200,
    description: 'Gold box invoices retrieved successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getGoldBoxInvoices(@Query() query: walletListQueryDto) {
    return this.walletService.findGolBoxInvoice(query);
  }

  @Get('/walletInvoices')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retrieve wallet payment invoices' })
  @ApiResponse({
    status: 200,
    description: 'Wallet invoices retrieved successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getWalletInvoices(@Query() query: walletListQueryDto) {
    return this.walletService.findWalletInvoice(query);
  }
}
