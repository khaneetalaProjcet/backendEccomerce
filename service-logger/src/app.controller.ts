import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { LoggerService } from './app.service';
import { CreateLogDto } from './dtos/create-log.dto';

@Controller('logs')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @Post('/admin')
  async createAdminLog(@Body() createLogDto: CreateLogDto) {
    return this.loggerService.create({ ...createLogDto, role: 'admin' });
  }

  @Post('/user')
  async createUserLog(@Body() createLogDto: CreateLogDto) {
    return this.loggerService.create({ ...createLogDto, role: 'user' });
  }

  @Get()
  async getLogs(@Query('role') role?: 'admin' | 'user') {
    return this.loggerService.findAllLogs({role})
  }
}
