import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'Elliot', description: "The user's name" })
  name: string;

  @ApiProperty({ example: 'test@example.com', description: "The user's email" })
  email: string;

  @ApiProperty({
    example: 'This is my bio',
    description: "The users's biography",
  })
  bio: string;

  @ApiProperty({
    example: '2011-05-02',
    description: "The users's birthday in yyyy-mm-dd format",
  })
  birthdate: string;
}
