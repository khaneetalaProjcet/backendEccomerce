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
  ValidationPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { upgradeProfileDto } from './dto/upgradeProfile.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { compelteRegisterDto } from './dto/completeRegister.dto';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { UpdateAddressDto } from './dto/updateAdress.sto';
import { AddressDto } from './dto/addAdress.dto';
import { IdentityDto } from './dto/Identity.dto';
import { JwtAdminAuthGuard } from 'src/jwt/admin-jwt-auth.guard';
import { userFilterDto } from './dto/userFilter.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post('test-kafka')
  // async testKafka(@Body() body: any) {
  //   await this.userService.emitUserCreatedEvent(body);
  //   return { message: 'Kafka event sent', data: body };
  // }

  @Post('/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'complete user info' })
  @ApiResponse({
    status: 200,
    description: 'the user complete info successfully',
    schema: {
      example: {
        success: true,
        message: 'the user complete info successfully',
        error: null,
        data: {},
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
    schema: {
      example: {
        success: false,
        message: 'the ngo creation failed',
        error: 'forbidden user',
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
        message: 'this project already cpmpleted',
        error: 'duplicate project',
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
    type: compelteRegisterDto,
    description: 'data must like this dto',
  })
  complete(
    @Req() req: any,
    @Res() res: any,
    @Body(new ValidationPipe()) body: compelteRegisterDto,
  ) {
    console.log('reqUser', req.user);
    const userId = req.user.userId;
    return this.userService.completeRegister(userId, body);
  }

  @Post('/identity')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'identity user info' })
  @ApiResponse({
    status: 200,
    description: 'the user identity info successfully',
    schema: {
      example: {
        success: true,
        message: 'the user identity info successfully',
        error: null,
        data: {},
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
    schema: {
      example: {
        success: false,
        message: 'the ngo creation failed',
        error: 'forbidden user',
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
        message: 'this project already cpmpleted',
        error: 'duplicate project',
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
    type: IdentityDto,
    description: 'data must like this dto',
  })
  identity(
    @Req() req: any,
    @Res() res: any,
    @Body(new ValidationPipe()) body: IdentityDto,
  ) {
    console.log('reqUser', req.user);
    const userId = req.user.userId;
    console.log('body', body);

    return this.userService.identity(userId, body);
  }

  @Post('/update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'update user info' })
  @ApiResponse({
    status: 200,
    description: 'the user complete info successfully',
    schema: {
      example: {
        success: true,
        message: 'the user complete info successfully',
        error: null,
        data: {},
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
    schema: {
      example: {
        success: false,
        message: 'the ngo creation failed',
        error: 'forbidden user',
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
        message: 'this project already cpmpleted',
        error: 'duplicate project',
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
    type: upgradeProfileDto,
    description: 'data must like this dto',
  })
  upgrade(
    @Req() req: any,
    @Res() res: any,
    @Body(new ValidationPipe()) body: upgradeProfileDto,
  ) {
    console.log('reqUser', req.user);
    const userId = req.user.userId;
    return this.userService.upgradeProfile(userId, body);
  }

  @Get('/info')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get user info' })
  @ApiResponse({
    status: 200,
    description: 'the user complete info successfully',
    schema: {
      example: {
        success: true,
        message: 'the user complete info successfully',
        error: null,
        data: {},
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
    schema: {
      example: {
        success: false,
        message: 'the ngo creation failed',
        error: 'forbidden user',
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
        message: 'this project already cpmpleted',
        error: 'duplicate project',
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
  getUser(@Req() req: any, @Res() res: any) {
    console.log('reqUser', req.user);
    const userId = req.user.userId;
    return this.userService.findById(userId);
  }

  @Get('/admin/info/:userId')
  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get user info by admin' })
  @ApiResponse({
    status: 200,
    description: 'the user complete info successfully',
    schema: {
      example: {
        success: true,
        message: 'the user complete info successfully',
        error: null,
        data: {},
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
    schema: {
      example: {
        success: false,
        message: 'the ngo creation failed',
        error: 'forbidden user',
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
        message: 'this project already cpmpleted',
        error: 'duplicate project',
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
  getUserByAdmin(
    @Req() req: any,
    @Res() res: any,
    @Param('userId') userId: string,
  ) {
    console.log('reqUser', req.user);
    return this.userService.findByIdByAdmin(userId);
  }

  @Post('/address/add')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'add address to user ' })
  @ApiResponse({
    status: 200,
    description: 'the user complete info successfully',
    schema: {
      example: {
        success: true,
        message: 'the user complete info successfully',
        error: null,
        data: {},
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
    schema: {
      example: {
        success: false,
        message: 'the ngo creation failed',
        error: 'forbidden user',
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
        message: 'this project already cpmpleted',
        error: 'duplicate project',
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
    type: AddressDto,
    description: 'data must like this dto',
  })
  addAdress(
    @Req() req: any,
    @Res() res: any,
    @Body(new ValidationPipe()) body: AddressDto,
  ) {
    console.log('reqUser', req.user);
    const userId = req.user.userId;
    return this.userService.addAddress(userId, body);
  }

  @Post('/address/update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'update address for user' })
  @ApiResponse({
    status: 200,
    description: 'the user complete info successfully',
    schema: {
      example: {
        success: true,
        message: 'the user complete info successfully',
        error: null,
        data: {},
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
    schema: {
      example: {
        success: false,
        message: 'the ngo creation failed',
        error: 'forbidden user',
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
        message: 'this project already cpmpleted',
        error: 'duplicate project',
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
    type: UpdateAddressDto,
    description: 'data must like this dto',
  })
  updateAdress(
    @Req() req: any,
    @Res() res: any,
    @Body(new ValidationPipe()) body: UpdateAddressDto,
  ) {
    console.log('reqUser', req.user);
    const userId = req.user.userId;
    return this.userService.updateAddress(userId, body);
  }

  @Get('/address/remove/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'remove user address' })
  @ApiResponse({
    status: 200,
    description: 'get all ngo succeed',
    schema: {
      example: {
        success: true,
        message: 'get all ngo succeed',
        error: null,
        data: { ngoTabel: [], mapNgo: [] },
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
  removeAddress(@Req() req: any, @Res() res: any, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.userService.deleteAddress(userId, id);
  }

  @Get('/address')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get all user address' })
  @ApiResponse({
    status: 200,
    description: 'get all ngo succeed',
    schema: {
      example: {
        success: true,
        message: 'get all ngo succeed',
        error: null,
        data: { ngoTabel: [], mapNgo: [] },
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
  getUserAdress(@Req() req: any, @Res() res: any) {
    const userId = req.user.userId;
    return this.userService.getAddresses(userId);
  }

  @Get('/address/:addressId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get user address' })
  @ApiResponse({
    status: 200,
    description: 'get ngo succeed',
    schema: {
      example: {
        success: true,
        message: 'get address succeed',
        error: null,
        data: { ngoTabel: [], mapNgo: [] },
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
  getUserSpecificAdress(
    @Req() req: any,
    @Res() res: any,
    @Param('addressId') addressId: string,
  ) {
    return this.userService.getSpecificAddress(req, res, addressId);
  }

  @Post('/chs')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'identity user info' })
  @ApiResponse({
    status: 200,
    description: 'the user identity info successfully',
    schema: {
      example: {
        success: true,
        message: 'the user identity info successfully',
        error: null,
        data: {},
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
    schema: {
      example: {
        success: false,
        message: 'the ngo creation failed',
        error: 'forbidden user',
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
        message: 'this project already cpmpleted',
        error: 'duplicate project',
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
    description: 'data must like this dto',
  })
  changeStatus(
    @Req() req: any,
    @Res() res: any,
    @Body(new ValidationPipe()) body: any,
  ) {
    console.log('reqUser', req.user);
    const userId = req.user.userId;
    console.log('body', body.identityStatus);
    return this.userService.changeStatus(userId, body.identityStatus);
  }

  @Get('/remover')
  async deleter() {
    return this.userService.deletAll();
  }

  @Get('/admin/users')
  // @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth()
  async getAllUsers(@Query() query:userFilterDto) {
    return this.userService.getAllUser(query);
  }

  @Patch('/disable/:id')
  async disable(@Param('id') userId: string) {
    return this.userService.activation(userId);
  }

  @Get('/provinces')
  @UseGuards(JwtAdminAuthGuard)
  // @ApiBearerAuth()
  async getUsersProvinces() {
    return this.userService.getUsersProvinces();
  }
}
