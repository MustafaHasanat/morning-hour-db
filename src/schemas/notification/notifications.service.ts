import { UsersService } from '../users/users.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { filterNullsObject } from 'src/utils/helpers/filterNulls';
import { User } from '../users/entities/user.entity';
import { CustomResponseType } from 'src/types/custom-response.type';
import { GetAllProps } from 'src/types/get-operators.type';
import { AppService } from 'src/app.service';
import { NotificationFields } from 'src/enums/tables-fields.enum';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly usersService: UsersService,
    private readonly appService: AppService,
  ) {}

  async getNotifications({
    sortBy = NotificationFields.CONTENT,
    reverse = false,
    page = 1,
    conditions,
  }: GetAllProps<NotificationFields>): Promise<
    CustomResponseType<Notification[]>
  > {
    try {
      const findQuery = this.appService.filteredGetQuery({
        sortBy,
        reverse,
        page,
        conditions,
      });

      if (findQuery.status !== 200) {
        return {
          message: findQuery.message,
          data: null,
          status: findQuery.status,
        };
      }

      const response = await this.notificationRepository.find(findQuery.data);

      return {
        message: response.length
          ? 'Notifications have been found'
          : 'Notifications list is empty',
        data: response,
        status: 200,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async getNotificationById(
    id: string,
  ): Promise<CustomResponseType<Notification>> {
    try {
      const response = await this.notificationRepository.findOneBy({ id });

      return {
        message: response
          ? 'Notification has been found'
          : "Notification doesn't exist",
        data: response,
        status: response ? 200 : 404,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async createNotification(
    createNotificationDto: CreateNotificationDto,
  ): Promise<CustomResponseType<Notification>> {
    try {
      // check the user
      const user = await this.usersService.getUserById(
        createNotificationDto.user,
      );
      if (!user.data) {
        return {
          message: 'Provided user does not exist',
          data: null,
          status: 404,
        };
      }

      // create the notification
      const newNotification = this.notificationRepository.create({
        user: user.data as User,
      });

      const response = await this.notificationRepository.save(newNotification);

      return {
        message: 'Notification has been created successfully',
        data: response,
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

  async updateNotification(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<CustomResponseType<UpdateResult>> {
    try {
      const notification = await this.getNotificationById(id);
      const user = await this.usersService.getUserById(
        updateNotificationDto.user,
      );

      if (!notification || !user) {
        return {
          message: `Provided ${
            !notification ? 'notification' : 'user'
          } does not exist`,
          data: null,
          status: 400,
        };
      }

      const response = await this.notificationRepository.update(
        {
          id,
        },
        {
          user: user.data as User,
          ...filterNullsObject(updateNotificationDto),
        },
      );

      return {
        message: 'Notification has been updated successfully',
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

  async deleteAllNotifications(): Promise<CustomResponseType<DeleteResult>> {
    try {
      const response = await this.notificationRepository.query(
        `TRUNCATE TABLE "notification" CASCADE;`,
      );
      return {
        message: 'Notifications data are wiped out',
        data: response,
        status: 200,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async deleteNotification(
    id: string,
  ): Promise<CustomResponseType<DeleteResult>> {
    try {
      const response = await this.notificationRepository.delete(id);
      return {
        message: response
          ? 'Notification has been deleted successfully'
          : "Notification doesn't exist",
        data: response,
        status: response ? 200 : 404,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }
}
