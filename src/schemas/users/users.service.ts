/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

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

  getUserById(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  getUser(conditions: any) {
    return this.userRepository.findOneBy(conditions);
  }

  createUser(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  deleteAllUsers() {
    return this.userRepository.clear();
  }

  deleteUser(id: string) {
    return this.userRepository.delete(id);
  }
}
