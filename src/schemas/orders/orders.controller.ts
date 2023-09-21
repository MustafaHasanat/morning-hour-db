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
import { ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateOrderDto } from './dto/create-order.dto';
import { orderBody } from './dto/order-body';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ControllerWrapper } from 'src/decorators/controller-wrapper.decorator';
import { CreateUpdateWrapper } from 'src/decorators/create-update-wrapper.decorator';

@ControllerWrapper('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiQuery({ name: 'conditions', type: 'object', required: true })
  async getOrders(
    @Query() conditions: Record<string, any>,
    @Res() res: Response,
  ) {
    const response: CustomResponseDto =
      await this.ordersService.getOrders(conditions);

    return res.status(response.status).json(response);
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto =
      await this.ordersService.getOrderById(id);

    return res.status(response.status).json(response);
  }

  @Post()
  @CreateUpdateWrapper(CreateOrderDto, orderBody)
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Res() res: Response,
  ) {
    const { userId, items } = createOrderDto;
    const response: CustomResponseDto = await this.ordersService.createOrder({
      userId,
      items,
    });

    return res.status(response.status).json(response);
  }

  @Patch(':id')
  @CreateUpdateWrapper(CreateOrderDto, orderBody)
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Res() res: Response,
  ) {
    const { userId, items } = updateOrderDto;
    const response: CustomResponseDto = await this.ordersService.updateOrder(
      id,
      {
        userId,
        items,
      },
    );

    return res.status(response.status).json(response);
  }

  @Delete('wipe')
  async deleteAllOrders(@Res() res: Response) {
    const response: CustomResponseDto =
      await this.ordersService.deleteAllOrders();

    return res.status(response.status).json(response);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto =
      await this.ordersService.deleteOrder(id);

    return res.status(response.status).json(response);
  }
}
