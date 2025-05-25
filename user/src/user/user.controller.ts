import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, ValidationPipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AddressDto, compelteRegisterDto } from './dto/completeRegister.dto';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { UpdateAddressDto } from './dto/updateAdress.sto';



@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/complete")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'complete user info' })
  @ApiResponse({
    status: 200, description: 'the user complete info successfully',
    schema: {
      example: {
        success: true,
        message: 'the user complete info successfully',
        error: null,
        data: {}
      }
    },
  })
  @ApiResponse({
    status: 403, description: 'Forbidden.',
    schema: {
      example: {
        success: false,
        message: 'the ngo creation failed',
        error: 'forbidden user',
        data: null
      }
    },
  })
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
    type:compelteRegisterDto ,
    description: 'data must like this dto',
  })
  complete(@Req() req : any , @Res() res : any , @Body(new ValidationPipe()) body: compelteRegisterDto) {
    console.log("reqUser",req.user);
    const userId=req.user.userId
    return this.userService.completeRegister(userId,body);
  }
  @Post("/update")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'update user info' })
  @ApiResponse({
    status: 200, description: 'the user complete info successfully',
    schema: {
      example: {
        success: true,
        message: 'the user complete info successfully',
        error: null,
        data: {}
      }
    },
  })
  @ApiResponse({
    status: 403, description: 'Forbidden.',
    schema: {
      example: {
        success: false,
        message: 'the ngo creation failed',
        error: 'forbidden user',
        data: null
      }
    },
  })
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
    type:UpdateUserDto ,
    description: 'data must like this dto',
  })
  upgrade(@Req() req : any , @Res() res : any , @Body(new ValidationPipe()) body: compelteRegisterDto) {
    console.log("reqUser",req.user);
    const userId=req.user.userId
    return this.userService.upgradeProfile(userId,body);
  }

  @Get("/info")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'get user info' })
  @ApiResponse({
    status: 200, description: 'the user complete info successfully',
    schema: {
      example: {
        success: true,
        message: 'the user complete info successfully',
        error: null,
        data: {}
      }
    },
  })
  @ApiResponse({
    status: 403, description: 'Forbidden.',
    schema: {
      example: {
        success: false,
        message: 'the ngo creation failed',
        error: 'forbidden user',
        data: null
      }
    },
  })
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
  getUser(@Req() req : any , @Res() res : any ) {
    console.log("reqUser",req.user);
    const userId=req.user.userId
    return this.userService.findById(userId);
  }


  @Post("/address/add")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'add address to user ' })
  @ApiResponse({
    status: 200, description: 'the user complete info successfully',
    schema: {
      example: {
        success: true,
        message: 'the user complete info successfully',
        error: null,
        data: {}
      }
    },
  })
  @ApiResponse({
    status: 403, description: 'Forbidden.',
    schema: {
      example: {
        success: false,
        message: 'the ngo creation failed',
        error: 'forbidden user',
        data: null
      }
    },
  })
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
    type:AddressDto ,
    description: 'data must like this dto',
  })
  addAdress(@Req() req : any , @Res() res : any , @Body(new ValidationPipe()) body: AddressDto) {
    console.log("reqUser",req.user);
    const userId=req.user.userId
    return this.userService.addAddress(userId,body);
  }


  @Post("/address/update")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'update address for user' })
  @ApiResponse({
    status: 200, description: 'the user complete info successfully',
    schema: {
      example: {
        success: true,
        message: 'the user complete info successfully',
        error: null,
        data: {}
      }
    },
  })
  @ApiResponse({
    status: 403, description: 'Forbidden.',
    schema: {
      example: {
        success: false,
        message: 'the ngo creation failed',
        error: 'forbidden user',
        data: null
      }
    },
  })
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
    type:UpdateAddressDto ,
    description: 'data must like this dto',
  })
  updateAdress(@Req() req : any , @Res() res : any , @Body(new ValidationPipe()) body: UpdateAddressDto) {
    console.log("reqUser",req.user);
    const userId=req.user.userId
    return this.userService.updateAddress(userId,body);
  }





  @Get("/address/remove/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'remove user address' })
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
  removeAddress(@Req() req : any , @Res() res : any ,@Param('id') id: string) {
    const userId=req.user.userId
    return this.userService.deleteAddress(userId,id);
  }




  @Get("/address")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'get all user address' })
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
  getUserAdress(@Req() req : any , @Res() res : any ) {
    const userId=req.user.userId
    return this.userService.getAddresses(userId);
  }





}
