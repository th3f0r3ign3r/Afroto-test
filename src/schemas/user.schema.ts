import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({
    type: String,
    minlength: [3, 'Too short name'],
    required: [true, 'Name required'],
  })
  name: string;

  @Prop({
    type: String,
    unique: [true, 'This email address already exists'],
    required: [true, 'Email address is required'],
  })
  email: string;

  @Prop({
    type: String,
    minlength: 8,
    required: [true, 'Password is required'],
  })
  password: string;

  @Prop({
    type: String,
    default: 'user',
  })
  role: string;

  @Prop({
    type: String,
  })
  bio: string;

  @Prop({
    type: Date,
    required: [true, 'Birthdate is required'],
  })
  birthdate: Date;

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

export const UserSchema = SchemaFactory.createForClass(User);
