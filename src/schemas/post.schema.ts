import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop({
    type: String,
    minlength: [3, 'Too short title'],
    required: [true, 'Title required'],
  })
  title: string;

  @Prop({
    type: String,
    required: [true, 'Title required'],
  })
  message: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: [true, 'Author is required'],
  })
  author: User;

  @Prop({
    type: Date,
    default: new Date(),
  })
  createdAt: Date;

  @Prop({
    type: Date,
    default: new Date(),
  })
  updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
