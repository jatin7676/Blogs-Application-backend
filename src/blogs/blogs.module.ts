import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { Blog, BlogSchema } from './schemas/blog.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: User.name, schema: UserSchema },
    ]),
    SupabaseModule,
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
