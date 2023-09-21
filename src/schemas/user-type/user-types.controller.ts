import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UserTypesService } from './user-types.service';
import { CustomResponseDto } from 'src/dtos/custom-response.dto';
import { ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { userTypeBody } from './dto/user-type-body';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';
import { ControllerWrapper } from 'src/decorators/controller-wrapper.decorator';
import { CreateUpdateWrapper } from 'src/decorators/create-update-wrapper.decorator';

@ControllerWrapper('userTypes')
export class UserTypesController {
  constructor(private readonly userTypesService: UserTypesService) {}

  @Get()
  @ApiQuery({ name: 'conditions', type: 'object', required: true })
  async getUserTypes(
    @Query() conditions: Record<string, any>,
    @Res() res: Response,
  ) {
    const response: CustomResponseDto =
      await this.userTypesService.getUserTypes(conditions);

    return res.status(response.status).json(response);
  }

  @Get(':id')
  async getUserTypeById(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto =
      await this.userTypesService.getUserTypeById(id);

    return res.status(response.status).json(response);
  }

  @Post()
  @CreateUpdateWrapper(CreateUserTypeDto, userTypeBody)
  async createUserType(
    @Body() createUserTypeDto: CreateUserTypeDto,
    @Res() res: Response,
  ) {
    const { userId, role } = createUserTypeDto;
    const response: CustomResponseDto =
      await this.userTypesService.createUserType({
        userId,
        role,
      });

    return res.status(response.status).json(response);
  }

  @Patch(':id')
  @CreateUpdateWrapper(UpdateUserTypeDto, userTypeBody)
  async updateUserType(
    @Param('id') id: string,
    @Body() updateUserTypeDto: UpdateUserTypeDto,
    @Res() res: Response,
  ) {
    const { userId, role } = updateUserTypeDto;
    const response: CustomResponseDto =
      await this.userTypesService.updateUserType(id, {
        userId,
        role,
      });

    return res.status(response.status).json(response);
  }

  @Delete('wipe')
  async deleteAllUserTypes(@Res() res: Response) {
    const response: CustomResponseDto =
      await this.userTypesService.deleteAllUserTypes();

    return res.status(response.status).json(response);
  }

  @Delete(':id')
  async deleteUserType(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto =
      await this.userTypesService.deleteUserType(id);

    return res.status(response.status).json(response);
  }
}
