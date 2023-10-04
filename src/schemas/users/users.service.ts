import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
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
import { CustomResponseType } from 'src/types/custom-response.type';
import { GetAllProps } from 'src/types/get-operators.type';
import { FilterOperator, UserFields } from 'src/enums/sorting-fields.enum';
import { AppService } from 'src/app.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly appService: AppService,
  ) {}

  private passwordRemover(user: User): User {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest as User;
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

  async getUsers({
    sortBy = UserFields.USERNAME,
    reverse = false,
    page = 1,
    withPass = false,
    conditions = [],
  }: GetAllProps<UserFields> & { withPass?: boolean }): Promise<
    CustomResponseType<User[]>
  > {
    try {
      const findQuery = this.appService.filteredGetQuery({
        conditions,
        sortBy,
        page,
        reverse,
      });

      if (findQuery.status !== 200) {
        return {
          message: findQuery.message,
          data: null,
          status: findQuery.status,
        };
      }

      const response = await this.userRepository.find(findQuery.data);

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

  async getUserById(id: string): Promise<CustomResponseType<User>> {
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
  ): Promise<CustomResponseType<User>> {
    try {
      if (
        createUserDto.role === UserRole.ADMIN &&
        (!userTokenData || userTokenData.role === UserRole.MEMBER)
      ) {
        return {
          message:
            'Unauthorized entrance, you must be an admin to create another admin account',
          data: null,
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
        status: 201,
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
  ): Promise<CustomResponseType<UpdateResult>> {
    try {
      if (updateUserDto.password) {
        return {
          message: `You're not allowed to change your password from this endpoint`,
          data: null,
          status: 403,
        };
      }

      const user = await this.getUserById(id);
      if (!user) {
        return {
          message: `Provided user does not exist`,
          data: null,
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
          data: null,
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

  async deleteAllUsers(): Promise<CustomResponseType<DeleteResult>> {
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

  async deleteUser(
    id: string,
    userTokenData: FullTokenPayload,
  ): Promise<CustomResponseType<DeleteResult>> {
    try {
      const user = await this.getUserById(id);
      if (user.status === 404) {
        return {
          message: `User ${id} doesn't exist`,
          data: null,
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
          data: null,
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

  async logIn(
    email: string,
    password: string,
  ): Promise<CustomResponseType<string>> {
    try {
      const response = await this.getUsers({
        withPass: true,
        conditions: [
          {
            filteredTerm: {
              dataType: 'string',
              value: email,
            },
            filterOperator: FilterOperator.CONTAINS,
            field: UserFields.EMAIL,
          },
        ],
      });

      if (!response?.data?.length) {
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

  // async resetPassword(): Promise<CustomResponseType<any>> {
  //   try {
  //     const text = 'this is a test';

  //     const data = {
  //       to: 'mustfaaayyed@gmail.com',
  //       from: 'mustafa.hasanat99@gmail.com',
  //       subject: 'hello',
  //       text,
  //       html: `<strong>${text}</strong>`,
  //     };

  //     const response = await sendEmail(data);

  //     return {
  //       message: 'Password has been resat successfully',
  //       data: response,
  //       status: 200,
  //     };
  //   } catch (error) {
  //     return {
  //       message: 'Error occurred',
  //       data: error,
  //       status: 500,
  //     };
  //   }
  // }
}
