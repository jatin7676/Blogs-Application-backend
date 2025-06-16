import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Blog } from './schemas/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { User } from '../users/schemas/user.schema';
import { SupabaseService } from 'src/supabase/supabase.service';
import { Multer } from 'multer';
@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly supabaseService: SupabaseService,
  ) {}


  async uploadFile(file: Multer.File, bucket = 'blogs') {
    const supabase = this.supabaseService.getClient();
    const fileName = `${Date.now()}-${file.originalname}`;
    console.log(supabase, 'supabase');

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    console.log(error);

    if (error) throw new Error(error.message);


    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return { path: data.path, publicUrl: urlData.publicUrl };
  }

  async create(createBlogDto: CreateBlogDto, image: string, userId: string): Promise<Blog> {
    const user = await this.userModel.findById(userId);
    if (!user || user.role !== 'writer') {
      throw new UnauthorizedException('Only writers can create blog posts');
    }
    createBlogDto.image= image;
    const createdBlog = new this.blogModel({
      ...createBlogDto,
      author: new Types.ObjectId(userId),
      authorName: user.name,
    });
    return createdBlog.save();
  }

  async findByCategory(category: string): Promise<Blog[]> {
    return this.blogModel.find({ category })
  }

  async findAll(): Promise<Blog[]> {
    return this.blogModel
      .find()
      .populate('author', 'name email')
      .populate('likes', 'name email')
      .populate('comments.user', 'name email')
      .exec();
  }

  async findOne(id: string): Promise<any> {
    const blog = await this.blogModel
      .findById(id).populate('author', 'name')
      .exec();
      console.log(blog, 'blog');

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  
  }

  async likeBlog(blogId: string, userId: string): Promise<Blog> {
    const blog = await this.blogModel.findById(blogId);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const userObjectId = new Types.ObjectId(userId);
    const hasLiked = blog.likes.some((like) => like.toString() === userId);

    if (hasLiked) {
      blog.likes = blog.likes.filter((id) => id.toString() !== userId);
    } else {
      blog.likes.push(userObjectId);
    }

    return blog.save();
  }

  async addComment(
    blogId: string,
    userId: string,
    content: string,
  ): Promise<Blog> {
    const blog = await this.blogModel.findById(blogId);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    blog.comments.push({
      user: new Types.ObjectId(userId),
      content,
      createdAt: new Date(),
    });

    return blog.save();
  }
}
