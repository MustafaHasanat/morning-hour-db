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
import { OrdersService } from './orders.service';
import { CustomResponseDto } from 'src/dtos/custom-response.dto';
import { Response } from 'express';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ControllerWrapper } from 'src/decorators/controller-wrapper.decorator';
import { CreateUpdateWrapper } from 'src/decorators/create-update-wrapper.decorator';
import { createOrderBody } from './dto/create-order.body';
import { updateOrderBody } from './dto/update-order.body';
import { MembersOnly } from 'src/decorators/members.decorator';
import { AdminsOnly } from 'src/decorators/admins.decorator';
import { GetAllWrapper } from 'src/decorators/get-all-wrapper.decorator';
import { OrderFields } from 'src/enums/tables-fields.enum';
import {
  GetConditionsProps,
  GetQueryProps,
} from 'src/types/get-operators.type';
import { AppService } from 'src/app.service';

@ControllerWrapper('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly appService: AppService,
  ) {}

  @Get()
  @GetAllWrapper({
    fieldsEnum: OrderFields,
  })
  async getOrders(
    @Query()
    query: GetQueryProps<OrderFields>,
    @Res() res: Response,
  ) {
    const { sortBy, reverse, page, conditions } = query;
    const parsed: GetConditionsProps<OrderFields>[] =
      this.appService.validateGetConditions<OrderFields>(conditions);

    const response: CustomResponseDto = await this.ordersService.getOrders({
      sortBy: sortBy || OrderFields.CREATED_AT,
      reverse: reverse === 'true',
      page: Number(page),
      conditions: parsed || [],
    });
    return res.status(response.status).json(response);
  }

  @Get(':id')
  @MembersOnly()
  async getOrderById(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto =
      await this.ordersService.getOrderById(id);

    return res.status(response.status).json(response);
  }

  @Post()
  @MembersOnly()
  @CreateUpdateWrapper(CreateOrderDto, createOrderBody)
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Res() res: Response,
  ) {
    const response: CustomResponseDto =
      await this.ordersService.createOrder(createOrderDto);

    return res.status(response.status).json(response);
  }

  @Patch(':id')
  @AdminsOnly()
  @CreateUpdateWrapper(UpdateOrderDto, updateOrderBody)
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Res() res: Response,
  ) {
    const response: CustomResponseDto = await this.ordersService.updateOrder(
      id,
      updateOrderDto,
    );

    return res.status(response.status).json(response);
  }

  @Delete('wipe')
  @AdminsOnly()
  async deleteAllOrders(@Res() res: Response) {
    const response: CustomResponseDto =
      await this.ordersService.deleteAllOrders();

    return res.status(response.status).json(response);
  }

  @Delete(':id')
  @AdminsOnly()
  async deleteOrder(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto =
      await this.ordersService.deleteOrder(id);

    return res.status(response.status).json(response);
  }
}
