import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerController } from './app.controller';
import { LoggerService } from './app.service';
import { Log, LogSchema } from './entities/log.entity';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/newdatabase'),
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
  ],
  controllers: [LoggerController],
  providers: [LoggerService],
})
export class AppModule {}