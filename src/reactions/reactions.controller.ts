import { Controller } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';

@Controller()
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @MessagePattern('reactions.get')
  getReviewReactions(
    @Payload('id') id: string,
    @Payload('paginationDto') paginationDto: PaginationDto
  ) {
    return this.reactionsService.getReviewReactions(id, paginationDto);
  }

  @MessagePattern('reactions.create')
  createReaction(
    @Payload() createReactionDto: CreateReactionDto
  ) {
    return this.reactionsService.create(createReactionDto);
  }

  @MessagePattern('reactions.user.get')
  getUserReactions(
    @Payload('productId') productId: string,
    @Payload('authorId') authorId: string,
  ) {
    return this.reactionsService.getUserReactions(authorId, productId);
  }

  @MessagePattern('reactions.update')
  updateReaction(
    @Payload() updateReactionDto: UpdateReactionDto
  ) {
    return this.reactionsService.update(updateReactionDto.id, updateReactionDto);
  }

  @MessagePattern('reactions.delete')
  deleteReaction(
    @Payload('id') id: string
  ) {
    return this.reactionsService.delete(id);
  }
}
