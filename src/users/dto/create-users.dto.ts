import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Elliot', description: "The user's name" })
  name: string;

  @ApiProperty({ example: 'test@example.com', description: "The user's email" })
  email: string;

  @ApiProperty({ example: 'Azerty&11', description: "The users's password" })
  password: string;

  @ApiProperty({
    example: '2011-05-02',
    description: "The users's birthday in yyyy-mm-dd format",
  })
  birthdate: string;
}
