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
import { FullTokenPayload, TokenPayload } from 'src/types/token-payload.type';
import { Request } from 'express';
import { UserRole } from 'src/enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  private passwordRemover(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  getUserTokenData(req: Request) {
    const userTokenData = {
      ...req?.user,
    } as FullTokenPayload;

    userTokenData['expiredIn'] = `${Math.floor(
      (userTokenData.exp - userTokenData.iat) / 3600,
    )} Hours`;

    return userTokenData;
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

  async createUser(
    createUserDto: CreateUserDto,
    userTokenData: FullTokenPayload,
  ) {
    try {
      if (
        createUserDto.role === UserRole.ADMIN &&
        (!userTokenData || userTokenData.role === UserRole.MEMBER)
      ) {
        return {
          message:
            'Unauthorized entrance, you must be an admin to create another admin account',
          data: { token: userTokenData },
          status: 401,
        };
      }

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

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    userTokenData: FullTokenPayload,
  ) {
    try {
      const user = await this.getUserById(id);
      if (!user) {
        return {
          message: 'Invalid data',
          data: `Provided user does not exist`,
          status: 404,
        };
      }

      if (
        userTokenData.userId !== id &&
        userTokenData.role !== UserRole.ADMIN
      ) {
        return {
          message:
            "Unauthorized entrance, you're only allowed to update your account",
          data: { token: userTokenData, id },
          status: 401,
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

  async deleteUser(id: string, userTokenData: FullTokenPayload) {
    try {
      const user = await this.getUserById(id);
      if (user.status === 404) {
        return {
          message: "User doesn't exist",
          data: user,
          status: 404,
        };
      }

      if (
        userTokenData.userId !== id &&
        userTokenData.role !== UserRole.ADMIN
      ) {
        return {
          message:
            "Unauthorized entrance, you're only allowed to delete your account",
          data: { token: userTokenData, id },
          status: 401,
        };
      }

      const response = await this.userRepository.delete(id);

      // delete the image related to the file
      user?.data?.avatar &&
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

      const user: User = response.data[0];
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
        role: user?.role,
        email: user?.email,
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
