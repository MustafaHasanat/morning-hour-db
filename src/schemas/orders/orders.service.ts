/* eslint-disable @typescript-eslint/no-unused-vars */
import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { filterNullsObject } from 'src/utils/helpers/filterNulls';
import { User } from '../users/entities/user.entity';
import { ItemsService } from '../items/items.service';
import { CustomResponseType } from 'src/types/custom-response.type';
import { OrderFields } from 'src/enums/tables-fields.enum';
import { GetAllProps } from 'src/types/get-operators.type';
import { AppService } from 'src/app.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly appService: AppService,
  ) {}

  async getOrders({
    sortBy = OrderFields.CREATED_AT,
    reverse = false,
    page = 1,
    conditions,
  }: GetAllProps<OrderFields>): Promise<CustomResponseType<Order[]>> {
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

      const response = await this.orderRepository.find(findQuery.data);

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

  async getOrderById(id: string): Promise<CustomResponseType<Order>> {
    try {
      const response = await this.orderRepository.findOneBy({ id });
      const items = await this.itemsService.getItemsByOrderId(id);

      return {
        message: response ? 'Order has been found' : "Order doesn't exist",
        data: { ...response, items },
        status: response ? 200 : 404,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async createOrder(
    createOrderDto: CreateOrderDto,
  ): Promise<CustomResponseType<Order>> {
    try {
      // check the user
      const user = await this.usersService.getUserById(createOrderDto.user);
      const items = await this.itemsService.getItemsByIds(createOrderDto.items);

      if (!user.data || !items.data) {
        return {
          message: 'Provided user or items does not exist',
          data: null,
          status: 404,
        };
      }

      // create the order
      const newOrder = this.orderRepository.create({
        user: user.data as User,
        items: items.data,
      });

      const response = await this.orderRepository.save(newOrder);

      return {
        message: 'Order has been created successfully',
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

  async updateOrder(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<CustomResponseType<UpdateResult>> {
    try {
      const order = await this.getOrderById(id);
      const user = await this.usersService.getUserById(updateOrderDto.user);

      if (!order || !user) {
        return {
          message: `Provided ${!order ? 'order' : 'user'} does not exist`,
          data: null,
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

  async deleteAllOrders(): Promise<CustomResponseType<DeleteResult>> {
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

  async deleteOrder(id: string): Promise<CustomResponseType<DeleteResult>> {
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
