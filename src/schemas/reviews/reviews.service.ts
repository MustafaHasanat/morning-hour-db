/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';
import { UpdateReviewDto } from './dto/update-review.dto';
import { filterNullsObject } from 'src/utils/helpers/filterNulls';
import { CustomResponseType } from 'src/types/custom-response.type';
import { AppService } from 'src/app.service';
import { ReviewFields } from 'src/enums/tables-fields.enum';
import { GetAllProps } from 'src/types/get-operators.type';
import { User } from '../users/entities/user.entity';
import { Item } from '../items/entities/item.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly appService: AppService,
  ) {}

  async getReviews({
    sortBy = ReviewFields.RATING,
    reverse = false,
    page = 1,
    conditions,
  }: GetAllProps<ReviewFields>): Promise<CustomResponseType<Review[]>> {
    try {
      const findQuery = this.appService.filteredGetQuery({
        conditions,
        sortBy,
        page,
        reverse,
      });

      if (findQuery.status !== 200) {
        return {
          message: findQuery.message,
          data: null,
          status: findQuery.status,
        };
      }

      const response = await this.reviewRepository.find(findQuery.data);

      return {
        message: response.length
          ? 'Reviews have been found'
          : 'Reviews list is empty',
        data: response,
        status: 200,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async getReviewById(id: string): Promise<CustomResponseType<Review>> {
    try {
      const response = await this.reviewRepository.findOneBy({ id });
      return {
        message: response ? 'Review has been found' : "Review doesn't exist",
        data: response,
        status: response ? 200 : 404,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async getReviewsByItemId(item: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { item: { id: In([item]) } },
    });
  }

  async createReview(
    createReviewDto: CreateReviewDto,
  ): Promise<CustomResponseType<Review>> {
    try {
      const { user: userId, item: itemId, ...rest } = createReviewDto;

      // check the user and the item
      const user = await this.usersService.getUserById(userId);
      const item = await this.itemsService.getItemById(itemId);
      if (!user || !item) {
        return {
          message: `Provided ${!user ? 'user' : 'item'} does not exist`,
          data: null,
          status: 400,
        };
      }

      // create the review
      const newReview = this.reviewRepository.create({
        user: user.data as User,
        item: item.data as Item,
        ...rest,
      });
      const response = await this.reviewRepository.save(newReview);

      return {
        message: 'Review has been created successfully',
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

  async updateReview(
    id: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<CustomResponseType<UpdateResult>> {
    try {
      const { user: userId, item: itemId, ...rest } = updateReviewDto;

      // check the user, item, and review
      const user = await this.usersService.getUserById(userId);
      const item = await this.itemsService.getItemById(itemId);
      const review = await this.getReviewById(id);
      if (!user || !item || !review) {
        return {
          message: !review
            ? "Review doesn't exist"
            : `Provided ${!user ? 'user' : 'item'} does not exist`,
          data: null,
          status: 400,
        };
      }

      // update the review
      const response = await this.reviewRepository.update(
        {
          id,
        },
        {
          user: user.data as User,
          item: item.data as Item,
          ...filterNullsObject(rest),
        },
      );

      return {
        message: 'Review has been updated successfully',
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

  async deleteAllReviews(): Promise<CustomResponseType<DeleteResult>> {
    try {
      const response = await this.reviewRepository.query(
        'TRUNCATE TABLE review CASCADE;',
      );
      return {
        message: 'Reviews data are wiped out',
        data: response,
        status: 200,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async deleteReview(id: string): Promise<CustomResponseType<DeleteResult>> {
    try {
      const review = await this.getReviewById(id);
      if (!review.data) {
        return {
          message: `Review ${id} doesn't exist`,
          data: null,
          status: 404,
        };
      }

      const response = await this.reviewRepository.delete(id);
      return {
        message: 'Review has been deleted successfully',
        data: response,
        status: 200,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }
}
