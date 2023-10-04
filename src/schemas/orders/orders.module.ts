import { UsersModule } from './../users/users.module';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';
import { ItemsModule } from '../items/items.module';
import { AppModule } from 'src/app.module';

@Module({
  imports: [
    forwardRef(() => AppModule),
    UsersModule,
    ItemsModule,
    TypeOrmModule.forFeature([Order]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
