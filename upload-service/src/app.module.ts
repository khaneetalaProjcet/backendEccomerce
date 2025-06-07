import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import { UploadModule } from './upload/upload.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ 
    ConfigModule.forRoot({
      isGlobal: true, // ✅ this makes ConfigService available in all modules
    }),
    UploadModule],
  controllers: [AppController],
  providers: [AppService,JwtService],
})
export class AppModule {}
