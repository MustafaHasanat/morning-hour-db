import { Module, forwardRef } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { AuthorsModule } from '../authors/authors.module';
import { CategoriesModule } from '../categories/categories.module';
import { AppModule } from 'src/app.module';

@Module({
  imports: [
    forwardRef(() => AppModule),
    forwardRef(() => AuthorsModule),
    CategoriesModule,
    TypeOrmModule.forFeature([Item]),
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule {}
