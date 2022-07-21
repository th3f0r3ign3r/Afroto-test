import { FilterPostDto } from './dto/filter-post.dto';
import { Post, PostDocument } from './../schemas/post.schema';
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(createPostDto: CreatePostDto) {
    return {
      statusCode: 200,
      data: await new this.postModel({
        title: createPostDto.title,
        message: createPostDto.message,
        author: createPostDto.author,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).save(),
    };
  }

  async findAll(): Promise<Post[]> {
    return await this.postModel.find();
  }

  async findAllFilter(query: FilterPostDto): Promise<Post[]> {
    if (query?.author && query?.creationDate)
      return await this.postModel.aggregate([
        { $unwind: '$author' },
        {
          $match: {
            $and: [
              { author: new mongoose.Types.ObjectId(query.author) },
              {
                $expr: {
                  $eq: [
                    query.creationDate,
                    {
                      $dateToString: { date: '$createdAt', format: '%Y-%m-%d' },
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    else
      return await this.postModel.aggregate([
        { $unwind: '$author' },
        {
          $match: {
            $or: [
              { author: new mongoose.Types.ObjectId(query.author) },
              {
                $expr: {
                  $eq: [
                    query.creationDate,
                    {
                      $dateToString: { date: '$createdAt', format: '%Y-%m-%d' },
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
  }

  findOne(id: string) {
    return this.postModel.findById(id);
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    await this.postModel
      .findByIdAndUpdate(id, {
        title: updatePostDto.title,
        message: updatePostDto.message,
        updatedAt: new Date(),
      })
      .exec();
    console.log('first');
    return this.postModel.findOne({ _id: id });
  }

  async remove(id: string) {
    return await this.postModel.findByIdAndDelete(id).exec();
  }
}
