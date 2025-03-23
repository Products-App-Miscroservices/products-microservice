import { Controller } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

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

  @MessagePattern('reviews.get.review')
  findOne(
    @Payload('productId') productId: string,
    @Payload('authorId') authorId: string,
  ){
    return this.reviewsService.findByProductId(productId, authorId);
  }

  @MessagePattern('reviews.create')
  create(
    @Payload() createReviewDto: CreateReviewDto
  ) {
    return this.reviewsService.create(createReviewDto);
  }

  @MessagePattern('reviews.update')
  update(
    @Payload() updateReviewDto: UpdateReviewDto
  ) {
    return this.reviewsService.update(updateReviewDto.id, updateReviewDto);
  }

  @MessagePattern('reviews.delete')
  delete(
    @Payload('id') id: string
  ) {
    return this.reviewsService.hardDelete(id);
  }

}
