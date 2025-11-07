import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule,{ cors: false});
  app.enableCors({
    origin: ['https://blogs-application-frontend-ggrspyl0l.vercel.app', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
//https://blogs-application-frontend-ggrspyl0l.vercel.app/