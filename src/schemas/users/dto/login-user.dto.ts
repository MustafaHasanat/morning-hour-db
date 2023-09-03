import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'example@example.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: '12345' })
  password: string;
}
