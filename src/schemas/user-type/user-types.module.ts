import { UsersModule } from '../users/users.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserType } from './entities/user-type.entity';
import { UserTypesController } from './user-types.controller';
import { UserTypesService } from './user-types.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([UserType])],
  controllers: [UserTypesController],
  providers: [UserTypesService],
})
export class UserTypesModule {}
