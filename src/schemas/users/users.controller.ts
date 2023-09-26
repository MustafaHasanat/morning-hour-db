import {
  Body,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiQuery } from '@nestjs/swagger';
import { CustomResponseDto } from 'src/dtos/custom-response.dto';
import { Response } from 'express';
import { storeLocalFile } from 'src/utils/storageProcess/storage';
import { FileInterceptor } from '@nestjs/platform-express';
import { createUserBody } from './dto/create-user.body';
import { UpdateUserDto } from './dto/update-user.dto';
import { ControllerWrapper } from 'src/decorators/controller-wrapper.decorator';
import { CreateUpdateWrapper } from 'src/decorators/create-update-wrapper.decorator';
import { UserAuthGuard } from 'src/guards/user-auth.guard';
import { Request } from 'express';
import { AdminsOnly } from 'src/decorators/admins.decorator';
import { updateUserBody } from './dto/update-user.body';

@ControllerWrapper('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @AdminsOnly()
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
  async getUserById(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto = await this.usersService.getUserById(id);

    return res.status(response.status).json(response);
  }

  @UseGuards(UserAuthGuard)
  @Get('login/auth')
  getProfile(@Req() req: Request, @Res() res: Response) {
    return res.status(200).json({
      message: 'User is authenticated',
      data: req.user,
      status: 200,
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'email', type: 'string', required: true })
  @ApiQuery({ name: 'password', type: 'string', required: true })
  logIn(@Query() query: { email: string; password: string }) {
    const { email, password } = query;
    return this.usersService.logIn(email, password);
  }

  @Post()
  @CreateUpdateWrapper(CreateUserDto, createUserBody)
  @UseInterceptors(FileInterceptor('avatar', storeLocalFile('users')))
  async createUser(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    const response: CustomResponseDto = await this.usersService.createUser({
      avatar,
      ...createUserDto,
    });

    return res.status(response.status).json(response);
  }

  @Patch(':id')
  @CreateUpdateWrapper(UpdateUserDto, updateUserBody)
  @UseInterceptors(FileInterceptor('avatar', storeLocalFile('users')))
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() avatar: Express.Multer.File,
    @Res() res: Response,
  ) {
    const response: CustomResponseDto = await this.usersService.updateUser(id, {
      avatar,
      ...updateUserDto,
    });

    return res.status(response.status).json(response);
  }

  @Delete('wipe')
  deleteAllUsers() {
    return this.usersService.deleteAllUsers();
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
