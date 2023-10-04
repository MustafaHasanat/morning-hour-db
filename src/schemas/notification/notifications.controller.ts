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
import { NotificationsService } from './notifications.service';
import { CustomResponseDto } from 'src/dtos/custom-response.dto';
import { Response } from 'express';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ControllerWrapper } from 'src/decorators/controller-wrapper.decorator';
import { CreateUpdateWrapper } from 'src/decorators/create-update-wrapper.decorator';
import { createNotificationBody } from './dto/create-notification.body';
import { updateNotificationBody } from './dto/update-notification.body';
import { MembersOnly } from 'src/decorators/members.decorator';
import { AdminsOnly } from 'src/decorators/admins.decorator';
import { GetAllWrapper } from 'src/decorators/get-all-wrapper.decorator';
import { NotificationFields } from 'src/enums/tables-fields.enum';
import {
  GetConditionsProps,
  GetQueryProps,
} from 'src/types/get-operators.type';
import { AppService } from 'src/app.service';

@ControllerWrapper('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly appService: AppService,
  ) {}

  @Get()
  @MembersOnly()
  @GetAllWrapper({
    fieldsEnum: NotificationFields,
  })
  async getNotifications(
    @Query()
    query: GetQueryProps<NotificationFields>,
    @Res() res: Response,
  ) {
    const { sortBy, reverse, page, conditions } = query;
    const parsed: GetConditionsProps<NotificationFields>[] =
      this.appService.validateGetConditions<NotificationFields>(conditions);

    const response: CustomResponseDto =
      await this.notificationsService.getNotifications({
        sortBy: sortBy || NotificationFields.CONTENT,
        reverse: reverse === 'true',
        page: Number(page),
        conditions: parsed || [],
      });
    return res.status(response.status).json(response);
  }

  @Get(':id')
  @MembersOnly()
  async getNotificationById(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto =
      await this.notificationsService.getNotificationById(id);

    return res.status(response.status).json(response);
  }

  @Post()
  @MembersOnly()
  @CreateUpdateWrapper(CreateNotificationDto, createNotificationBody)
  async createNotification(
    @Body() createNotificationDto: CreateNotificationDto,
    @Res() res: Response,
  ) {
    const response: CustomResponseDto =
      await this.notificationsService.createNotification(createNotificationDto);

    return res.status(response.status).json(response);
  }

  @Patch(':id')
  @AdminsOnly()
  @CreateUpdateWrapper(UpdateNotificationDto, updateNotificationBody)
  async updateNotification(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
    @Res() res: Response,
  ) {
    const response: CustomResponseDto =
      await this.notificationsService.updateNotification(
        id,
        updateNotificationDto,
      );

    return res.status(response.status).json(response);
  }

  @Delete('wipe')
  @MembersOnly()
  async deleteAllNotifications(@Res() res: Response) {
    const response: CustomResponseDto =
      await this.notificationsService.deleteAllNotifications();

    return res.status(response.status).json(response);
  }

  @Delete(':id')
  @AdminsOnly()
  async deleteNotification(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto =
      await this.notificationsService.deleteNotification(id);

    return res.status(response.status).json(response);
  }
}
