import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';  // Add this import
import { JwtStrategy } from '../jwt/jwt.strategy';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';  // Add this import
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';  
import { UserService } from 'src/user/user.service';
import { TokenizeService } from 'src/tokenize/tokenize.service';


@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,  
    JwtModule.registerAsync({
      imports: [ConfigModule],  
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        // secret: configService.get('JWT_USER_SECRET'),
        // signOptions: { expiresIn: '7d' },  
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,UserService,JwtAuthGuard,JwtStrategy , TokenizeService],
})
export class AuthModule {}
