import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ReviewsService } from './reviews.service';
import { CustomResponseDto } from 'src/dtos/custom-response.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { reviewBody } from './dto/review-body';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Public } from 'src/decorators/public.decorator';

@ApiTags('Reviews')
@Controller('reviews')
@ApiBearerAuth()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @Public()
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
  @Public()
  async getReviewById(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto =
      await this.reviewsService.getReviewById(id);

    return res.status(response.status).json(response);
  }

  @Post()
  @ApiOkResponse({ type: CreateReviewDto })
  @ApiConsumes('multipart/form-data')
  @UsePipes(ValidationPipe)
  @ApiBody(reviewBody)
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
    @Res() res: Response,
  ) {
    const { text, rating, userId, itemId } = createReviewDto;
    const response: CustomResponseDto = await this.reviewsService.createReview({
      text,
      rating,
      userId,
      itemId,
    });

    return res.status(response.status).json(response);
  }

  @Patch(':id')
  @ApiOkResponse({ type: UpdateReviewDto })
  @ApiConsumes('multipart/form-data')
  @UsePipes(ValidationPipe)
  @ApiBody(reviewBody)
  async updateReview(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Res() res: Response,
  ) {
    const { text, rating, userId, itemId } = updateReviewDto;
    const response: CustomResponseDto = await this.reviewsService.updateReview(
      id,
      { text, rating, userId, itemId },
    );

    return res.status(response.status).json(response);
  }

  @Delete('wipe')
  async deleteAllReviews(@Res() res: Response) {
    const response: CustomResponseDto =
      await this.reviewsService.deleteAllReviews();

    return res.status(response.status).json(response);
  }

  @Delete(':id')
  async deleteReview(@Param('id') id: string, @Res() res: Response) {
    const response: CustomResponseDto =
      await this.reviewsService.deleteReview(id);

    return res.status(response.status).json(response);
  }
}
