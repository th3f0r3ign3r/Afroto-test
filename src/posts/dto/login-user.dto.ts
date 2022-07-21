import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'test@example.com', description: 'The user email' })
  email: string;

  @ApiProperty({
    example: 'Azerty&11',
    description: 'The user password',
  })
  password: string;
}
