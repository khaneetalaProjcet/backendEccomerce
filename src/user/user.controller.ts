import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '' })
  @ApiResponse({
    status: 200, description: 'the ngos created project successfully',
    schema: {
      example: {
        success: true,
        message: 'the ngo updated project successfully',
        error: null,
        data: {}
      }
    },
  })
  // @ApiResponse({
  //   status: 403, description: 'Forbidden.',
  //   schema: {
  //     example: {
  //       success: false,
  //       message: 'the ngo creation failed',
  //       error: 'forbidden user',
  //       data: null
  //     }
  //   },
  // })
  @ApiResponse({
    status: 409, description: 'duplicate data',
    schema: {
      example: {
        success: false,
        message: 'this project already cpmpleted',
        error: 'duplicate project',
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
    // type: ,
    description: 'Json structure for project object',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }





  @Get()
  @ApiOperation({ summary: 'دیتای صفحه ی سمن ها به همراه دیتای نقشه' })
  @ApiResponse({
    status: 200, description: 'get all ngo succeed',
    schema: {
      example: {
        success: true,
        message: 'get all ngo succeed',
        error: null,
        data: { ngoTabel: [], mapNgo: [] }
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
  findAll() {
    return this.userService.findAll();
  }


  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
