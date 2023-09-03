import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { LoginUserDto } from './login-user.dto';

export class CreateUserDto extends PartialType(LoginUserDto) {
  @IsNotEmpty()
  @ApiProperty({ example: 'Jack' })
  userName: string;
}
