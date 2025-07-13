import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto } from './dto/createPage.dto';
import { UpdatePageDto } from './dto/updatePage.dto';
import { UseGuards } from '@nestjs/common';

@Controller('page')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @UseGuards()
  @Post()
  create(@Body() createPageDto: any) {
    return this.pageService.create(createPageDto);
  }

  
  @Get()
  findAll() {
    return this.pageService.findAll();
  }

  @UseGuards()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pageService.findOne(id);
  }

  @UseGuards()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
    return this.pageService.update(id, updatePageDto);
  }

  @UseGuards()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pageService.remove(id);
  }
}
