import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User, UserRole } from '../users/schemas/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.WRITER)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file: Multer.File,
    @Request() req,
  ) {
    console.log(createBlogDto, 'createBlogDto');
    
      const image = await this.blogsService.uploadFile(file);

    
    return this.blogsService.create(createBlogDto,image.publicUrl, req.user.sub);
  }

  @Get()
  async findAll() {
   return this.blogsService.findAll();
   
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.blogsService.findOne(id);
    return data
   
  }

  @Get('category/:category')
  async findByCategory(@Param('category') category: string) {
    return this.blogsService.findByCategory(category);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async likeBlog(@Param('id') id: string, @Request() req) {
    return this.blogsService.likeBlog(id, req.user.sub);
  }

  @Post(':id/comment')
  @UseGuards(JwtAuthGuard)
  async addComment(
    @Param('id') id: string,
    @Body() body: { content: string },
    @Request() req,
  ) {
    return this.blogsService.addComment(id, req.user.sub, body.content);
  }
}
