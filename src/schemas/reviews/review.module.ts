import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review } from './entities/review.entity';
import { UsersModule } from '../users/users.module';
import { ItemsModule } from '../items/items.module';
import { AppModule } from 'src/app.module';

@Module({
  imports: [
    forwardRef(() => AppModule),
    UsersModule,
    ItemsModule,
    TypeOrmModule.forFeature([Review]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
