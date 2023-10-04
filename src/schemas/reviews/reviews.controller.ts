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
import { GetAllWrapper } from 'src/decorators/get-all-wrapper.decorator';
import {
  GetConditionsProps,
  GetQueryProps,
} from 'src/types/get-operators.type';
import { ReviewFields } from 'src/enums/sorting-fields.enum';
import { AppService } from 'src/app.service';

@ControllerWrapper('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly appService: AppService,
  ) {}

  @Get()
  @GetAllWrapper({
    fieldsEnum: ReviewFields,
  })
  async getReviews(
    @Query()
    query: GetQueryProps<ReviewFields>,
    @Res() res: Response,
  ) {
    const { sortBy, reverse, page, conditions } = query;
    const parsed: GetConditionsProps<ReviewFields>[] =
      this.appService.validateGetConditions<ReviewFields>(conditions);

    const response: CustomResponseDto = await this.reviewsService.getReviews({
      sortBy: sortBy || ReviewFields.TEXT,
      reverse: reverse === 'true',
      page: Number(page),
      conditions: parsed || [],
    });
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
