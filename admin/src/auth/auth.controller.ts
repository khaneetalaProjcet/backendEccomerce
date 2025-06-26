import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginAdminDto } from './dto/login.dto';
import { UpdateAdminDto } from 'src/admin/dto/update-admin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

   
    @Post('/login')
    @ApiOperation({ summary: 'validate otp code' })
    @ApiResponse({
      status: 200, description: 'the otp code validate and user login successfully',
      schema: {
        example: {
          success: true,
          message: 'با موفقیت وارد شدید',
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
      type: LoginAdminDto,
      description: 'Json structure for project object',
    })
   login(@Req() req : any , @Res() res : any , @Body(new ValidationPipe()) body: LoginAdminDto) {
    return this.authService.login(body.phoneNumber,body.password)
   }

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAdminDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
