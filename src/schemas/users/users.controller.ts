import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { hash } from 'bcrypt';
import { CustomResponseDto } from 'src/dtos/custom-response.dto';
import { Response } from 'express';
import { storeLocalFile } from 'src/utils/storage';
import { FileInterceptor } from '@nestjs/platform-express';
import { userBody } from './dto/user-body';
import { UpdateUserDto } from './dto/update-user.dto';

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
  async getUserById(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto = await this.usersService.getUserById(id);

    return res.status(response.status).json(response);
  }

  @Post()
  @ApiOkResponse({ type: CreateUserDto })
  @UsePipes(ValidationPipe)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar', storeLocalFile('users')))
  @ApiBody(userBody)
  async createUser(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    const {
      userName,
      email,
      password,
      phoneNumber,
      gender,
      pricingRange,
      address,
      isAdmin,
    } = createUserDto;
    const hashedPass = await hash(password, 12);

    const response: CustomResponseDto = await this.usersService.createUser({
      userName,
      email,
      password: hashedPass,
      phoneNumber,
      gender,
      pricingRange,
      address,
      isAdmin,
      avatar,
    });

    return res.status(response.status).json(response);
  }

  @Patch(':id')
  @ApiOkResponse({ type: UpdateUserDto })
  @UsePipes(ValidationPipe)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', storeLocalFile('users')))
  @ApiBody(userBody)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ) {
    const {
      userName,
      email,
      password,
      phoneNumber,
      gender,
      pricingRange,
      address,
      isAdmin,
    } = updateUserDto;
    const response: CustomResponseDto = await this.usersService.updateUser(id, {
      userName,
      email,
      password,
      phoneNumber,
      gender,
      pricingRange,
      address,
      isAdmin,
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
