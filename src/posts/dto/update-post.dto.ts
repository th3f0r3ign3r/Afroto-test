import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({ example: 'My first title', description: 'The post title' })
  title: string;

  @ApiProperty({
    example: 'My super fist long content',
    description: 'The post message',
  })
  message: string;
}
