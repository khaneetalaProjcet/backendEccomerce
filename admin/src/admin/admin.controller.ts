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
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { UpdateAdminAccessDto } from './dto/adminAccessibility.dto';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @EventPattern('user-created')
  async handleUserCreated(@Payload() message: any) {
    const userData =
      typeof message.value === 'string'
        ? JSON.parse(message.value)
        : message.value;

    console.log(' New user from UserService:', userData);
  }

  @Post('register')
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
  @Get('/access/:id')
  async getAdminAccess(@Param('id') id: string) {
    return this.adminService.getAdminAccess(id);
  }

  @Post('access/:id')
  @ApiOperation({ summary: 'Update admin access pages' })
  @ApiParam({ name: 'id', description: 'Admin ID' })
  @ApiBody({ type: UpdateAdminAccessDto })
  @ApiResponse({
    status: 200,
    description: 'Admin access updated',
  })
  @ApiResponse({
    status: 404,
    description: 'Admin not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Access is currently locked',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error during access update',
  })
  async addAdminAccessibility(
    @Param('id') id: string,
    @Body() updateAdminAccessDto: UpdateAdminAccessDto,
  ) {
    return this.adminService.updateAdminAccess(
      id,
      updateAdminAccessDto.pageIds,
    );
  }

  @Get('/')
  @ApiOperation({ summary: 'List all admins' })
  @ApiResponse({
    status: 200,
    description: 'All admins returned successfully',
  })
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one admin by ID' })
  @ApiParam({ name: 'id', description: 'Admin ID' })
  @ApiResponse({
    status: 200,
    description: 'Admin found',
  })
  @ApiResponse({
    status: 400,
    description: 'Admin not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an admin' })
  @ApiParam({ name: 'id', description: 'Admin ID' })
  @ApiBody({ type: UpdateAdminDto })
  @ApiResponse({
    status: 200,
    description: 'Admin updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Update is locked or admin not found',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAuthDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an admin' })
  @ApiParam({ name: 'id', description: 'Admin id' })
  @ApiResponse({
    status: 200,
    description: 'Admin deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Admin not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Remove is locked',
  })
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
