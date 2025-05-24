import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/interceptors.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);


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
    .setDescription('this is api documentation of shop project')
    .setVersion('1.0')
    .addServer('http://localhost:9011/', 'Local environment')
    .addServer("https://shop.khaneetala.ir,'Stage")
    .addTag('wallet')
    .addBearerAuth()
    .build();
  process.nextTick(()=>{
    console.log('next tick done')
  })
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);


  app.useGlobalInterceptors(new ResponseInterceptor());
  // app.useGlobalFilters(new HttpExceptionFilter());
  
  await app.listen(process.env.PORT ?? 9011);
}
bootstrap();
