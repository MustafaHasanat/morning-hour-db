/* eslint-disable @typescript-eslint/no-unused-vars */
import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { filterNullsObject } from 'src/utils/helpers/filterNulls';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly usersService: UsersService,
  ) {}

  async getOrders(conditions: Record<string, any>) {
    try {
      const response = await this.orderRepository.findBy(conditions);

      return {
        message: response.length
          ? 'Orders have been found'
          : 'Orders list is empty',
        data: response,
        status: 200,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async getOrderById(id: string) {
    try {
      const response = await this.orderRepository.findOneBy({ id });
      return {
        message: response ? 'Order has been found' : "Order doesn't exist",
        data: response,
        status: response ? 200 : 404,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    try {
      // check the user
      const user = await this.usersService.getUserById(createOrderDto.userId);
      if (!user) {
        return {
          message: 'Error occurred',
          data: 'Provided user does not exist',
          status: 400,
        };
      }

      // create the order
      const newOrder = this.orderRepository.create(createOrderDto);
      const response = await this.orderRepository.save(newOrder);

      return {
        message: 'Order has been created successfully',
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

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.getOrderById(id);
      const user = await this.usersService.getUserById(updateOrderDto.userId);

      if (!order || !user) {
        return {
          message: 'Invalid data',
          data: `Provided ${!order ? 'order' : 'user'} does not exist`,
          status: 400,
        };
      }

      const response = await this.orderRepository.update(
        {
          id,
        },
        filterNullsObject(updateOrderDto),
      );

      return {
        message: 'Order has been updated successfully',
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

  async deleteAllOrders() {
    try {
      const response = await this.orderRepository.query(
        `TRUNCATE TABLE "order" CASCADE;`,
      );
      return {
        message: 'Orders data are wiped out',
        data: response,
        status: 200,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async deleteOrder(id: string) {
    try {
      const response = await this.orderRepository.delete(id);
      return {
        message: response
          ? 'Order has been deleted successfully'
          : "Order doesn't exist",
        data: response,
        status: response ? 200 : 404,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }
}
