import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { deleteFile, deleteFiles } from 'src/utils/storageProcess/deleteFiles';
import { compare, hash } from 'bcrypt';
import { filterNullsObject } from 'src/utils/helpers/filterNulls';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from 'src/types/token-payload.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  passwordRemover(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  async getUsers(conditions: Record<string, any>, withPass: boolean = false) {
    try {
      const response = await this.userRepository.findBy(conditions);

      // remove the password from all the users before sending response
      const updatedUsers = response.map((user) => {
        return withPass ? user : this.passwordRemover(user);
      });

      return {
        message: response.length
          ? 'Users have been found'
          : 'Users list is empty',
        data: updatedUsers,
        status: 200,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async getUserById(id: string) {
    try {
      const response = await this.userRepository.findOneBy({ id });

      if (!response) {
        return {
          message: "User doesn't exist",
          data: response,
          status: 404,
        };
      }

      return {
        message: 'User has been found',
        data: this.passwordRemover(response),
        status: 200,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const hashedPass = await hash(createUserDto.password, 12);

      const newUser = this.userRepository.create({
        ...createUserDto,
        avatar: createUserDto.avatar?.filename || '',
        password: hashedPass,
      });
      const response = await this.userRepository.save(newUser);

      return {
        message: 'User has been created successfully',
        data: this.passwordRemover(response),
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

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.getUserById(id);
      if (!user) {
        return {
          message: 'Invalid data',
          data: `Provided user does not exist`,
          status: 404,
        };
      }

      const newObject = filterNullsObject({
        ...updateUserDto,
        avatar: updateUserDto?.avatar?.filename,
      });

      const response = await this.userRepository.update(
        {
          id,
        },
        newObject,
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
        `TRUNCATE TABLE "user" CASCADE;`,
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

  async logIn(email: string, password: string) {
    try {
      const response = await this.getUsers({ email }, true);
      if (response?.data?.length === 0) {
        return {
          message: 'Invalid email',
          data: email,
          status: 400,
        };
      }

      const user = response.data[0];
      if (!(await compare(password, user?.password))) {
        return {
          message: 'Invalid password',
          data: password,
          status: 400,
        };
      }

      const payload: TokenPayload = {
        userId: user?.id,
        username: user?.userName,
      };

      return {
        message: 'Token has been generated',
        data: await this.jwtService.signAsync(payload),
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
}
