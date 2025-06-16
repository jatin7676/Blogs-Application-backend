import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

@Schema({ timestamps: true })
export class Blog extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  readingTime: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorName: string;
  
  @Prop({ required: true })
  image: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    default: [],
  })
  likes: Types.ObjectId[];

  @Prop({
    type: [
      {
        user: { type: Types.ObjectId, ref: 'User' },
        content: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  comments: Array<{
    user: Types.ObjectId;
    content: string;
    createdAt: Date;
  }>;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
