import { Controller } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @MessagePattern('reviews.get')
  getProductReviews(
    @Payload('id') id: string,
    @Payload('paginationDto') paginationDto: PaginationDto
  ) {
    return this.reviewsService.getProductReviews(id, paginationDto);
  }

  @MessagePattern('reviews.create')
  create(
    @Payload() createReviewDto: CreateReviewDto
  ) {
    return this.reviewsService.create(createReviewDto);
  }

  @MessagePattern('reviews.update')
  update() {
    return 'Método para hacer update a review';
  }

  @MessagePattern('reviews.delete')
  delete() {
    return 'Método para hacer delete a review';
  }

}
