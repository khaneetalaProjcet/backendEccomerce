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
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { UpdateAdminAccessDto } from './dto/adminAccessibility.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/register')
  @ApiOperation({ summary: 'validate otp code' })
  @ApiResponse({
    status: 200,
    description: 'the otp code validate and user login successfully',
    schema: {
      example: {
        success: true,
        message: 'با موفقیت وارد شدید',
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
    type: CreateAdminDto,
    description: 'Json structure for project object',
  })
  register(
    @Req() req: any,
    @Res() res: any,
    @Body(new ValidationPipe()) body: CreateAdminDto,
  ) {
    return this.adminService.register(body);
  }

  
  @Get('/info')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'validate otp code' })
  @ApiResponse({
    status: 200,
    description: 'the otp code validate and user login successfully',
    schema: {
      example: {
        success: true,
        message: 'با موفقیت وارد شدید',
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
  async check(@Req() req: any, @Res() res: any) {
    console.log(req.user);

    return await this.adminService.findById(req.user.userId);
  }

  @Post('access/:id')
  async addAdminAccessibility(
    @Param('id') id: string,
    @Body() updateAdminAccessDto: UpdateAdminAccessDto,
  ) {
    return this.adminService.updateAdminAccess(id, updateAdminAccessDto.pageIds);
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
