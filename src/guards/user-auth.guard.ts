/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserRole } from 'src/enums/user-role.enum';
import { User } from 'src/schemas/users/entities/user.entity';
import { UsersService } from 'src/schemas/users/users.service';
import { TokenPayload } from 'src/types/token-payload.type';
import constants from 'src/utils/constants/auth.constants';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  private getDecoratorKeys(keys: string[], context: ExecutionContext) {
    return keys.map((key) => {
      return this.reflector.getAllAndOverride<boolean>(key, [
        context.getHandler(),
        context.getClass(),
      ]);
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [isPublic, membersOnly, adminsOnly] = this.getDecoratorKeys(
      [
        constants.IS_PUBLIC_KEY,
        constants.IS_MEMBERS_ONLY,
        constants.IS_ADMINS_ONLY,
      ],
      context,
    );

    console.log(membersOnly, adminsOnly);

    // both of them are false (membersOnly, adminsOnly) -> it's a public endpoint
    if (!membersOnly && !adminsOnly) {
      return true;
    }

    // one of them is true (membersOnly, adminsOnly) -> not a public endpoint
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Unauthorized request, members only');
    }

    try {
      const payload: TokenPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = payload;

      const user: { data: User } = await this.usersService.getUserById(
        payload.userId,
      );

      if (user.data.role === UserRole.MEMBER && adminsOnly) {
        throw new UnauthorizedException('Unauthorized request, admins only');
      }
    } catch (error) {
      throw new BadRequestException({
        message: 'Unexpected error occurred',
        data: error.response,
        status: 400,
      });
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
