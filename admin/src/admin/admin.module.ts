import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin,AdminSchema } from './entities/admin.entity';
import { JwtStrategy } from 'src/jwt/jwt.strategy';

@Module({
  imports:[MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }])],
  controllers: [AdminController],
  providers: [AdminService,JwtStrategy],
})
export class AdminModule {}
