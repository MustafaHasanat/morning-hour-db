/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
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

  async getAllUsers() {
    const users = await this.userRepository.find();

    // remove the password from all the users before sending response
    const deprecatedPassUsers = users.map((user) => {
      const { password, ...rest } = user;
      return rest;
    });

    return deprecatedPassUsers;
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
