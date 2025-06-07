import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAdminStrategy } from 'src/jwt/admin-jwt.strategy';
@Module({
  controllers: [UploadController],
  providers: [UploadService,JwtService,JwtAdminStrategy]
})
export class UploadModule {}
