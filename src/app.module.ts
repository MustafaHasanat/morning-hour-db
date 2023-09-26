/* eslint-disable @typescript-eslint/no-unused-vars */
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorsModule } from './schemas/authors/authors.module';
import { CategoriesModule } from './schemas/categories/categories.module';
import { ItemsModule } from './schemas/items/items.module';
import { UsersModule } from './schemas/users/users.module';
import entities from './entities';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { UserAuthGuard } from './guards/user-auth.guard';
import { OrdersModule } from './schemas/orders/orders.module';
import { ReviewsModule } from './schemas/reviews/review.module';
import constants from 'src/utils/constants/auth.constants';
import { BackendGuard } from './guards/backend.guard';
import { AssetsModule } from './schemas/assets/assets.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: entities,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: constants.ONE_HOUR },
    }),
    // PassportModule.register({ defaultStrategy: 'google' }),
    AuthorsModule,
    CategoriesModule,
    ItemsModule,
    OrdersModule,
    ReviewsModule,
    UsersModule,
    AssetsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: UserAuthGuard,
    },
  ],
})
export class AppModule {
  // Apply the guard middleware to all routes in this app to prevent unauthorized requests
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(BackendGuard)
    //   .forRoutes({ path: '*', method: RequestMethod.ALL });
    // consumer
    //   .apply(BackendGuard)
    //   .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
