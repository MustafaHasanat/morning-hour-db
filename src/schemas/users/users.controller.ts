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
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody } from '@nestjs/swagger';
import { CustomResponseDto } from 'src/dtos/custom-response.dto';
import { Response } from 'express';
import { storeLocalFile } from 'src/utils/storageProcess/storage';
import { FileInterceptor } from '@nestjs/platform-express';
import { createUserBody } from './dto/create-user.body';
import { UpdateUserDto } from './dto/update-user.dto';
import { ControllerWrapper } from 'src/decorators/controller-wrapper.decorator';
import { CreateUpdateWrapper } from 'src/decorators/create-update-wrapper.decorator';
import { Request } from 'express';
import { updateUserBody } from './dto/update-user.body';
import { MembersOnly } from 'src/decorators/members.decorator';
import { AdminsOnly } from 'src/decorators/admins.decorator';
import { LoginUserDto } from './dto/login-user.dto';
import { FullTokenPayload } from 'src/types/token-payload.type';
import { GetAllWrapper } from 'src/decorators/get-all-wrapper.decorator';
import { UserFields } from 'src/enums/tables-fields.enum';
import {
  GetConditionsProps,
  GetQueryProps,
} from 'src/types/get-operators.type';
import { AppService } from 'src/app.service';

@ControllerWrapper('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly appService: AppService,
  ) {}

  getUserTokenData(req: Request): FullTokenPayload {
    return this.usersService.getUserTokenData(req);
  }

  @Get()
  // @AdminsOnly()
  @GetAllWrapper({
    fieldsEnum: UserFields,
  })
  async getUsers(
    @Query()
    query: GetQueryProps<UserFields>,
    @Res() res: Response,
  ) {
    const { sortBy, reverse, page, conditions } = query;
    const parsed: GetConditionsProps<UserFields>[] =
      this.appService.validateGetConditions<UserFields>(conditions);

    const response: CustomResponseDto = await this.usersService.getUsers({
      sortBy: sortBy || UserFields.USERNAME,
      reverse: reverse === 'true',
      page: Number(page),
      conditions: parsed || [],
    });
    return res.status(response.status).json(response);
  }

  @Get(':id')
  @MembersOnly()
  async getUserById(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto = await this.usersService.getUserById(id);

    return res.status(response.status).json(response);
  }

  @Get('login/auth')
  getProfile(@Req() req: Request, @Res() res: Response) {
    return res.status(200).json({
      message: 'User is authenticated',
      data: this.getUserTokenData(req),
      status: 200,
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginUserDto })
  logIn(@Body() body: LoginUserDto) {
    const { email, password } = body;
    return this.usersService.logIn(email, password);
  }

  // @Post('resetPassword')
  // @HttpCode(HttpStatus.OK)
  // resetPassword() {
  //   return this.usersService.resetPassword();
  // }

  @Post()
  @CreateUpdateWrapper(CreateUserDto, createUserBody)
  @UseInterceptors(FileInterceptor('avatar', storeLocalFile('users')))
  async createUser(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response: CustomResponseDto = await this.usersService.createUser(
      {
        avatar,
        ...createUserDto,
      },
      this.getUserTokenData(req),
    );

    return res.status(response.status).json(response);
  }

  @Patch(':id')
  @MembersOnly()
  @CreateUpdateWrapper(UpdateUserDto, updateUserBody)
  @UseInterceptors(FileInterceptor('avatar', storeLocalFile('users')))
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() avatar: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response: CustomResponseDto = await this.usersService.updateUser(
      id,
      {
        avatar,
        ...updateUserDto,
      },
      this.getUserTokenData(req),
    );

    return res.status(response.status).json(response);
  }

  @Delete('wipe')
  @AdminsOnly()
  deleteAllUsers() {
    return this.usersService.deleteAllUsers();
  }

  @Delete(':id')
  @MembersOnly()
  async deleteUser(@Param('id') id: string, @Req() req: Request) {
    return this.usersService.deleteUser(id, this.getUserTokenData(req));
  }
}
