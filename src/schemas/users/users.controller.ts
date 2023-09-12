import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { hash } from 'bcrypt';
import { CustomResponseDto } from 'src/dtos/custom-response.dto';
import { Response } from 'express';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiQuery({ name: 'conditions', type: 'object', required: true })
  async getUsers(
    @Query() conditions: Record<string, any>,
    @Res() res: Response,
  ) {
    const response: CustomResponseDto =
      await this.usersService.getUsers(conditions);

    return res.status(response.status).json(response);
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const { userName, email, password } = createUserDto;
    const hashedPass = await hash(password, 12);

    return this.usersService.createUser({
      userName,
      email,
      password: hashedPass,
    });
  }

  @Delete('wipe')
  deleteAllAuthors() {
    return this.usersService.deleteAllUsers();
  }

  @Delete(':id')
  deleteAuthor(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
