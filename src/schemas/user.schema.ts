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
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Incorrect email',
    ],
    unique: [true, 'This email address already exists'],
    required: [true, 'Email address is required'],
  })
  email: string;

  @Prop({
    type: String,
    match: [
      /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/,
      'Password must contain at least 1 number, capitalized letter, lowercase letter and special characters.',
    ],
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
