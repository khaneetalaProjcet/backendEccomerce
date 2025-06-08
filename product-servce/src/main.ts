import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { kafkaConsumerConfig } from './kafka/kafka.config';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    logger: WinstonModule.createLogger({
      transports: [
        new transports.Console({
          format: format.combine(
            format.timestamp(),
            format.colorize(),
            format.printf(({ timestamp, level, message, context }) => {
              return `[${timestamp}] ${level} [${context || 'App'}]: ${message}`;
            })
          )
        }),
        new transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: format.combine(format.timestamp(), format.json()),
        }),
        new transports.File({
          filename: 'logs/combined.log',
          format: format.combine(format.timestamp(), format.json()),
        }),
      ],
    }),
  });
  app.enableCors({
    origin: '*', // specify the allowed origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // specify the allowed HTTP methods
  })
  process.on('unhandledRejection', (error) => {
    console.log('error occured . . .', error)
  });

  process.on('uncaughtException', (error) => {
    console.log('error occured', error)
  })

  process.on('unhandledException', (error) => {
    console.log('error occured . . .', error)
  })

  app.useGlobalPipes(new ValidationPipe({
    transform: true // Transform is recomended configuration for avoind issues with arrays of files transformations
  }));
  const options = new DocumentBuilder()
    .setTitle('Khanetala shop APIs')
    .setDescription('this is api documentation of Ecommerce project')
    .setVersion('1.0')
    .addServer('http://localhost:9014/', 'Local environment')
    .addServer("https://shop.khaneetala.ir,'Stage")
    .addTag('PRODUCT SERVICE')
    .addBearerAuth()
    .build();
  process.nextTick(()=>{
    console.log('next tick done')
  })
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);


  app.useGlobalInterceptors(new ResponseInterceptor());

   app.connectMicroservice(kafkaConsumerConfig);
   await app.startAllMicroservices();
 // app.useGlobalFilters(new HttpExceptionFilter());
  
  await app.listen(process.env.PORT ?? 9014);
  
}
bootstrap();
