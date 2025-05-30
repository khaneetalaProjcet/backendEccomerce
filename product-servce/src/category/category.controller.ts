import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

 @Post()
 @ApiOperation({ summary: 'Create a new category' })
 @ApiBody({ type: CreateCategoryDto })
  create(@Req() req : any , @Res() res : any,@Body() dto: CreateCategoryDto) {
    return this.categoryService.createCategory(dto.name,dto.parent);
  }


@Post('update/:id')
@ApiOperation({ summary: 'Update a category name by ID' })
@ApiBody({ type: UpdateCategoryDto })
update(@Req() req : any , @Res() res : any,@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
  return this.categoryService.updateCategory(id, dto);
}

@Get('remove/:id')
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
