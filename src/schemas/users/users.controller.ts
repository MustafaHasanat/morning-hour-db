import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { hash } from 'bcrypt';
import { Public } from 'src/decorators/public.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Public()
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
