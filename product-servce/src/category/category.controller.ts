import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import {JwtAuthGuard} from "../jwt/jwt-auth.guard"
import { JwtAdminAuthGuard } from '..//jwt/admin-jwt-auth.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

 @Post()
 @UseGuards(JwtAdminAuthGuard)
 @ApiBearerAuth()
 @ApiOperation({ summary: 'Create a new category' })
 @ApiBody({ type: CreateCategoryDto })
  create(@Req() req : any , @Res() res : any,@Body() dto: CreateCategoryDto) {
    console.log("admin",req.user);
    
    return this.categoryService.createCategory(dto.name,dto.description,dto.parent);
  }


@Post('update/:id')
@UseGuards(JwtAdminAuthGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Update a category name by ID' })
@ApiBody({ type: UpdateCategoryDto })
update(@Req() req : any , @Res() res : any,@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
  return this.categoryService.updateCategory(id, dto);
}

@Get('remove/:id')
@UseGuards(JwtAdminAuthGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Remove a category  by ID' })
remove(@Req() req : any , @Res() res : any,@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
  return this.categoryService.deleteCategory(id);
}

@Get('tree')
@ApiOperation({ summary: 'Get all  category in tree form' })
getTree(@Req() req : any , @Res() res : any,@Param('id') id: string) {
  return this.categoryService.getCategoryTree();
}








  // @Get()
  // findAll() {
  //   return this.categoryService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.categoryService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
  //   return this.categoryService.update(+id, updateCategoryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.categoryService.remove(+id);
  // }
}
