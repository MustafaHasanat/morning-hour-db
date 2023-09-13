/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { deleteFile, deleteFiles } from 'src/utils/deleteFiles';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUsers(conditions: Record<string, any>) {
    try {
      const response = await this.userRepository.findBy(conditions);

      // remove the password from all the users before sending response
      const deprecatedPassUsers = response.map((user) => {
        const { password, ...rest } = user;
        return rest;
      });

      return {
        message: response.length
          ? 'Users have been found'
          : 'Users list is empty',
        data: deprecatedPassUsers,
        status: 200,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async getUserById(id: string) {
    try {
      const response = await this.userRepository.findOneBy({ id });
      return {
        message: response ? 'User has been found' : "User doesn't exist",
        data: response,
        status: response ? 200 : 404,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const newUser = this.userRepository.create({
        ...createUserDto,
        avatar: createUserDto.avatar.filename,
      });
      const response = await this.userRepository.save(newUser);

      return {
        message: 'User has been created successfully',
        data: response,
        status: 200,
      };
    } catch (error) {
      return {
        message: 'Error occurred',
        data: !createUserDto.avatar?.filename
          ? 'You must provide a valid avatar image'
          : error,
        status: 500,
      };
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.getUserById(id);
      if (!user) {
        return {
          message: 'Invalid data',
          data: `Provided user does not exist`,
          status: 400,
        };
      }

      const response = await this.userRepository.update(
        {
          id,
        },
        {
          ...updateUserDto,
          avatar: updateUserDto.avatar.filename,
        },
      );

      return {
        message: 'User has been updated successfully',
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

  async deleteAllUsers() {
    try {
      const response = await this.userRepository.query(
        'TRUNCATE TABLE author CASCADE;',
      );

      // delete all files in the dir
      deleteFiles('./public/assets/users/');

      return {
        message: 'Users data are wiped out',
        data: response,
        status: 200,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.getUserById(id);
      if (user.status === 404) {
        return {
          message: "User doesn't exist",
          data: user,
          status: 404,
        };
      }

      const response = await this.userRepository.delete(id);

      // delete the image related to the file
      deleteFile('./public/assets/users/' + user?.data?.avatar);

      return {
        message: 'User has been deleted successfully',
        data: response,
        status: 200,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }
}
