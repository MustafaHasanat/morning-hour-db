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
import { ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { ReviewsService } from './reviews.service';
import { CustomResponseDto } from 'src/dtos/custom-response.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { createReviewBody } from './dto/create-review.body';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ControllerWrapper } from 'src/decorators/controller-wrapper.decorator';
import { CreateUpdateWrapper } from 'src/decorators/create-update-wrapper.decorator';
import { updateReviewBody } from './dto/update-review.body';
import { MembersOnly } from 'src/decorators/members.decorator';
import { AdminsOnly } from 'src/decorators/admins.decorator';

@ControllerWrapper('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @ApiQuery({ name: 'conditions', type: 'object', required: true })
  async getReviews(
    @Query() conditions: Record<string, any>,
    @Res() res: Response,
  ) {
    const response: CustomResponseDto =
      await this.reviewsService.getReviews(conditions);

    return res.status(response.status).json(response);
  }

  @Get(':id')
  async getReviewById(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto =
      await this.reviewsService.getReviewById(id);

    return res.status(response.status).json(response);
  }

  @Post()
  @MembersOnly()
  @CreateUpdateWrapper(CreateReviewDto, createReviewBody)
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
    @Res() res: Response,
  ) {
    const response: CustomResponseDto =
      await this.reviewsService.createReview(createReviewDto);

    return res.status(response.status).json(response);
  }

  @Patch(':id')
  @AdminsOnly()
  @CreateUpdateWrapper(UpdateReviewDto, updateReviewBody)
  async updateReview(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Res() res: Response,
  ) {
    const response: CustomResponseDto = await this.reviewsService.updateReview(
      id,
      updateReviewDto,
    );

    return res.status(response.status).json(response);
  }

  @Delete('wipe')
  @AdminsOnly()
  async deleteAllReviews(@Res() res: Response) {
    const response: CustomResponseDto =
      await this.reviewsService.deleteAllReviews();

    return res.status(response.status).json(response);
  }

  @Delete(':id')
  @MembersOnly()
  async deleteReview(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto =
      await this.reviewsService.deleteReview(id);

    return res.status(response.status).json(response);
  }
}
