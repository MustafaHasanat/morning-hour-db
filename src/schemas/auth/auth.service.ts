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
    const user = await this.usersService.getUser({ email });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('Unauthorized !!!');
    }

    const payload = { sub: user.id, username: user.userName };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
