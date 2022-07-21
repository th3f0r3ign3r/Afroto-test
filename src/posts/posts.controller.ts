import { FilterPostDto } from './dto/filter-post.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    const { id } = req.user;
    createPostDto.author = id;
    const errors = [];
    if (createPostDto.title.length < 5)
      errors.push('Title is required and must be at least 5 characters');
    if (createPostDto.message.length < 15)
      errors.push('Message is required and must be at least 15 characters');
    if (errors.length !== 0) return { statusCode: 417, errors };
    return this.postsService.create(createPostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: FilterPostDto) {
    if (!(query?.author || query?.creationDate))
      return this.postsService.findAll();
    else return this.postsService.findAllFilter(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ) {
    const errors = [];
    const userId = req.user.id;
    const post = await this.postsService.findOne(id);
    if (post.author[0].toString() !== userId)
      return { statusCode: 401, message: "This post doesn't belong to you" };
    else {
      if (updatePostDto.title.length < 5)
        errors.push('Title is required and must be at least 5 characters');
      if (updatePostDto.message.length < 15)
        errors.push('Message is required and must be at least 15 characters');
      if (errors.length !== 0) return { statusCode: 417, errors };
      return this.postsService.update(id, updatePostDto);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    const post = await this.postsService.findOne(id);
    if (post.author[0].toString() !== userId)
      return { statusCode: 401, message: "This post doesn't belong to you" };
    else {
      return this.postsService.remove(id);
    }
  }
}
