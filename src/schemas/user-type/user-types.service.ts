/* eslint-disable @typescript-eslint/no-unused-vars */
import { UsersService } from '../users/users.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserType } from './entities/user-type.entity';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';

@Injectable()
export class UserTypesService {
  constructor(
    @InjectRepository(UserType)
    private readonly userTypeRepository: Repository<UserType>,
    private readonly usersService: UsersService,
  ) {}

  async getUserTypes(conditions: Record<string, any>) {
    try {
      const response = await this.userTypeRepository.findBy(conditions);

      return {
        message: response.length
          ? 'User Types have been found'
          : 'User Types list is empty',
        data: response,
        status: 200,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async getUserTypeById(id: string) {
    try {
      const response = await this.userTypeRepository.findOneBy({ id });
      return {
        message: response
          ? 'The User-Type has been found'
          : "The User-Type doesn't exist",
        data: response,
        status: response ? 200 : 404,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async createUserType(createUserTypeDto: CreateUserTypeDto) {
    try {
      // create the userType
      const newUserType = this.userTypeRepository.create(createUserTypeDto);
      const response = await this.userTypeRepository.save(newUserType);

      return {
        message: 'User-Type has been created successfully',
        data: response,
        status: 200,
      };
    } catch (error) {
      return {
        message: 'Error occurred',
        data: error,
        status: 500,
      };
    }
  }

  async updateUserType(id: string, updateUserTypeDto: UpdateUserTypeDto) {
    try {
      const userType = await this.getUserTypeById(updateUserTypeDto.userId);

      if (!userType) {
        return {
          message: 'Invalid data',
          data: 'Provided user type does not exist',
          status: 404,
        };
      }

      const response = await this.userTypeRepository.update(
        {
          id,
        },
        updateUserTypeDto,
      );

      return {
        message: 'User-Type has been updated successfully',
        data: response,
        status: 200,
      };
    } catch (error) {
      return {
        message: 'Error occurred',
        data: error,
        status: 500,
      };
    }
  }

  async deleteAllUserTypes() {
    try {
      const response = await this.userTypeRepository.query(
        `TRUNCATE TABLE "userType" CASCADE;`,
      );
      return {
        message: 'User-Types data are wiped out',
        data: response,
        status: 200,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async deleteUserType(id: string) {
    try {
      const response = await this.userTypeRepository.delete(id);
      return {
        message: response
          ? 'User-Type has been deleted successfully'
          : "User-Type doesn't exist",
        data: response,
        status: response ? 200 : 404,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }
}
