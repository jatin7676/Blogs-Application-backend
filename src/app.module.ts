import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://yadav2002jatin:Goku2002@cluster0.cub3rla.mongodb.net/blog'),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key', // In production, use environment variable
      signOptions: { expiresIn: '1d' },
    }),
    PassportModule,
    AuthModule,
    UsersModule,
    BlogsModule,
  ],
})
export class AppModule {}
