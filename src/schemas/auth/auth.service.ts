import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async logIn(email: string, password: string) {
    const response = await this.usersService.getUsers({ email }, true);

    if (!response) {
      throw new BadRequestException('Invalid email');
    }

    const user = response.data[0];

    if (!(await compare(password, user?.password))) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { sub: user?.id, username: user?.userName };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
